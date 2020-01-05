const fs = require('fs')

const data =  JSON.parse(fs.readFileSync('src/data.json'))
const outdir = (fileName) => `snippets/${fileName}`

const storeSnippets = {}
Object.keys(data.stores).forEach(store => {
  const properties = data.stores[store]
  storeSnippets[store] = {
    prefix: ['Store', store],
    description: `Store: StoreRegistry.get${store}()`,
    body: [
      `StoreRegistry.get${store}().\${2${properties}}(\${3:viewContext})`,
      "$0"
    ]
  }
})

fs.writeFileSync(outdir('storeSnippets.json'), JSON.stringify(storeSnippets))

const helpers = data.helpers
  .map((helper) => helper.charAt(0).toUpperCase() + helper.substring(1))
  .sort()
  .join(',')

const helperSnippets = {
  HelperRegistry: {
    prefix: ['Wise', 'HelperRegistry'],
    description: 'HelperRegistry helper',
    body: [
      `const \${3:variable} = HelperRegistry.get\${1|${helpers}|}().\${2:helperMethod}($0)`
    ]
  }
}

fs.writeFileSync(outdir('helperSnippets.json'), JSON.stringify(helperSnippets))

const actionList = `|${data.actions.sort().join(',')}|`
const actionSnippets = {
  fireAction: {
    prefix: ['Wise', 'fireAction'],
    description: 'Wise ActionRegistry actions list',
    body: [
      `ActionDispatcher.fireAction(ActionRegistry.\${1${actionList}}, \${2:actionContext})`
    ]
  },
  ActionRegistry: {
    prefix: ['Wise', 'ActionRegistry'],
    description: 'Wise ActionRegistry actions list',
    body: [
      `ActionRegistry.\${1${actionList}}`
    ]
  }
}

fs.writeFileSync(outdir('actionSnippets.json'), JSON.stringify(actionSnippets))

// Protos
const protos =  JSON.parse(fs.readFileSync('src/protos.json'))
const protoSnippets = {}
Object.keys(protos).forEach((objectName) => {
  Object.keys(protos[objectName]).forEach((methodName) => {
    const method = protos[objectName][methodName]

    let variableName = ''
    // if (method.returns !== 'void') {
    //   variableName = `const \${${method.params.length + 1}:${method.returns || methodName}} = `
    // }

    const parameters = method.params
      .map((parameterName, index) => `\${${index + 1}:${parameterName}}`)
      .join(', ')

    const body = [
      `${variableName}${objectName}.${methodName}(${parameters})`
    ]

    const key = `${objectName}.${methodName}`
    protoSnippets[key] = {
      prefix: [objectName, methodName],
      description: `Insert the function: ${objectName}.${methodName}(${method.params.join(', ')})`,
      body
    }
  })
})

fs.writeFileSync(outdir('protoSnippets.json'), JSON.stringify(protoSnippets))