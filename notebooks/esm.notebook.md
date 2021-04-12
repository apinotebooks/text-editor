```javascript esm {"run_on_load":true}
// There is also an ES module cell type, any variable or function you export is available in the global scope
// In ES Modules you can use top-level imports like you are probably used to
import twas from "https://cdn.skypack.dev/twas"

// This value is now available in any cell as it is exported
export const javascriptInventionDate = Date.parse('04 Dec 1995 00:12:00 GMT')

// The default export gets printed below and used as cell return value
export default "Javascript was invented " + twas(javascriptInventionDate)
```