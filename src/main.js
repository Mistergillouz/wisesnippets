const fs = require('fs')

const data =  JSON.parse(fs.readFileSync('src/data.json'))

const storeSnippets = {}
Object.keys(data.stores).forEach(store => {
  const properties = data.stores[store]
  storeSnippets[store] = {
    prefix: `Store: ${store}`,
    description: `Store: StoreRegistry.get${store}()`,
    body: [
      `const \${1:variable} = StoreRegistry.get${store}().\${2${properties}}(\${3:viewContext})`,
      "$0"
    ]
  }
})

fs.writeFileSync('src/storeSnippets.json', JSON.stringify(storeSnippets))

const helpers = data.helpers
  .map((helper) => helper.charAt(0).toUpperCase() + helper.substring(1))
  .sort()
  .join(',')

const helperSnippets = {
  HelperRegistry: {
    prefix: 'Wise: HelperRegistry',
    description: 'HelperRegistry helper',
    body: [
      `const \${1:variable} = HelperRegistry.get\${2|${helpers}|}().\${3:method}($0)`
    ]
  }
}

fs.writeFileSync('src/helperSnippets.json', JSON.stringify(helperSnippets))

const actionList = `|${data.actions.sort().join(',')}|`
const actionSnippets = {
  ActionRegistry: {
    prefix: 'Wise: fireAction',
    description: 'Wise ActionRegistry actions list',
    body: [
      `ActionDispatcher.fireAction(ActionRegistry.\${1${actionList}}, \${2:actionContext})`
    ]
  }
}

fs.writeFileSync('src/actionSnippets.json', JSON.stringify(actionSnippets))