'use strict'

const OneBlink = require('@oneblink/sdk')

module.exports.post = async function (req, res) {
  const submissionData = req.body.submission
  const submissionValues = Object.values(submissionData)
  const yesCount = submissionValues.filter((value) => value === 'Yes').length
  const noCount = submissionValues.filter((value) => value === 'No').length
  const naCount = submissionValues.filter((value) => value === 'N/A').length

  const url = `
    <div class="custom-modal"><table class="generated-chart charts-css bar show-labels show-primary-axis show-5-secondary-axes data-spacing-5 hide-data"><caption>Checklist Summary</caption><thead><tr><th scope="col">Value</th><th scope="col">Total</th></tr></thead><tbody><tr><th scope="row">Yes</th><td style="--size: calc(${yesCount} / 10); --color: var(--color-4)"><span class="data">${yesCount}</span></td></tr><tr><th scope="row">No</th><td style="--size: calc(${noCount} / 10); --color: var(--color-1)"><span class="data">${noCount}</span></td></tr><tr><th scope="row">N/A</th><td style="--size: calc(${naCount} / 10); --color: var(--color-3)"><span class="data">${naCount}</span></td></tr></tbody></table></div>
  `

  let generatedElements = []
  const generatedChart = OneBlink.Forms.generateFormElement({
    type: 'html',
    name: 'generatedChart',
    label: 'generatedChart',
    defaultValue: url,
  })
  generatedElements.push(generatedChart)

  return res.setStatusCode(200).setPayload(generatedElements)
}
