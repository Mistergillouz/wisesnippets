const fs = require('fs')

const data =  JSON.parse(fs.readFileSync('src/data.json'))

const storeSnippets = {}
Object.keys(data.stores).forEach(store => {
  const properties = data.stores[store]
  storeSnippets[store] = {
    prefix: `store: ${store}`,
    description: `store: StoreRegistry.get${store}()`,
    body: [
      `const \${1:variable} = StoreRegistry.get${store}().\${2${properties}}(\${3:viewContext})`,
      "$0"
    ]
  }
})

fs.writeFileSync('src/storeSnippets.json', JSON.stringify(storeSnippets))

const helperSnippets = {}
data.helpers.forEach((helper) => {
  const helperName = helper.charAt(0).toUpperCase() + helper.substring(1)
  helperSnippets[helperName] = {
    prefix: `helper: ${helperName}`,
    description: `HelperRegister.get${helperName}()`,
    body: [
      `const \${1:variable} = HelperRegistry.get${helperName}().\${2:methodName}($0)`
    ]
  }
})

fs.writeFileSync('src/helperSnippets.json', JSON.stringify(helperSnippets))
