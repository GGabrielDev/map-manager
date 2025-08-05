export { default as Permission } from './Permission'
export { default as Role } from './Role'
export { default as User } from './User'

// TypeScript: `import * as` gets all named exports from this file
import * as models from './index' // This is safe because TypeScript's module system resolves this after the exports above
import { JoinModels } from './join'

// Build ModelsArray dynamically from the named exports, excluding non-model exports
const { ModelsArray: _ignore1, ...namedModels } = models

export const ModelsArray = [...Object.values(namedModels), ...JoinModels]