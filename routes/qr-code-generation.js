'use strict'

const OneBlink = require('@oneblink/sdk')
const QRCode = require('qrcode')

const opts = {
  width: 256,
  margin: 2,
}

module.exports.post = async function (req, res) {
  const formUrl = req.body.submission.formUrl
  const elements = req.body.submission.elements
  const repeatableSets = req.body.submission.repeatableSets

  let preFillData = {}

  // Extract elements from submission
  elements.map((elem) => {
    preFillData[elem.elementName] = elem.value
  })

  // Extract repeatableSets from submission
  if (repeatableSets && repeatableSets.length > 0) {
    repeatableSets.map((set) => {
      if (!preFillData[set.repeatableSetName]) {
        preFillData[set.repeatableSetName] = []
      }
      preFillData[set.repeatableSetName].push(
        set.repeatableSetElements.reduce((acc, elem) => {
          acc[elem.elementName] = elem.value
          return acc
        }, {})
      )
    })
  }

  const url = `${formUrl}?preFillData=${JSON.stringify(preFillData)}`

  console.log(url)

  const generatedURI = await QRCode.toDataURL(url, opts)

  let generatedElements = []
  const qrcode = OneBlink.Forms.generateFormElement({
    type: 'image',
    name: 'qrcode',
    label: 'qrcode',
    defaultValue: generatedURI,
  })
  generatedElements.push(qrcode)

  const generatedUrl = OneBlink.Forms.generateFormElement({
    type: 'html',
    name: 'generatedUrl',
    label: 'generatedUrl',
    defaultValue: url,
  })
  generatedElements.push(generatedUrl)

  return res.setStatusCode(200).setPayload(generatedElements)
}
