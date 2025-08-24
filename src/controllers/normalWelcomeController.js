const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path')

const fontImpactPath = path.resolve(__dirname, '..', 'assets', 'fonts', 'Impact-Regular.ttf')
registerFont(fontImpactPath, { family: 'Impact' })

exports.generateWelcomeImage = async (req, res) => {
  const username = (req.query.username || 'Texas').toUpperCase()
  const avatarUrl = req.query.avatarUrl || ''
  const backgroundUrl = req.query.backgroundUrl || path.join(__dirname, '..', 'assets', 'default-bg.png')
  const logoUrl = req.query.logoUrl || path.join(__dirname, '..', 'assets', 'default-logo.png')
  const textColor = req.query.textColor || '#FFFFFF'
  const borderColor = req.query.borderColor || '#FF0000'
  const customText = (req.query.customText || 'Gracias por estar con nosotros').toUpperCase()
  const welcomeText = (req.query.welcomeText || 'WELCOME').toUpperCase()

  const width = 1920
  const height = 1080
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  try {
    const background = await loadImage(backgroundUrl)
    context.drawImage(background, 0, 0, width, height)
  } catch {
    context.fillStyle = '#000000'
    context.fillRect(0, 0, width, height)
  }

  try {
    const logo = await loadImage(logoUrl)
    context.drawImage(logo, width - 220, 20, 200, 200)
  } catch {}

  let avatar
  try {
    avatar = await loadImage(avatarUrl || path.join(__dirname, '..', 'assets', 'default-avatar.png'))
  } catch {
    avatar = await loadImage(path.join(__dirname, '..', 'assets', 'default-avatar.png'))
  }

  const avatarRadius = 260
  context.save()
  context.beginPath()
  context.arc(960, 400, avatarRadius, 0, Math.PI * 2, true)
  context.closePath()
  context.clip()
  context.drawImage(avatar, 960 - avatarRadius, 400 - avatarRadius, avatarRadius * 2, avatarRadius * 2)
  context.restore()

  const drawCenteredText = (text, y, fontSize, color, weight = 'normal') => {
    context.fillStyle = color
    context.font = `${weight} ${fontSize}px Impact`
    const textWidth = context.measureText(text).width
    context.fillText(text, (width - textWidth) / 2, y)
  }

  drawCenteredText(welcomeText, 780, 100, textColor, 'bold')
  drawCenteredText(username, 870, 70, textColor, 'bold')
  drawCenteredText(customText, 950, 60, borderColor, 'bold')

  const buffer = canvas.toBuffer('image/png')
  res.type('image/png')
  res.send(buffer);
};
