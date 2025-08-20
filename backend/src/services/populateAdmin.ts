import { 
  Permission,
  Role,
  User,
} from '@/models'

const entities = [
  'Permission',
  'Role',
  'User',
  'State',
  'Municipality',
  'Parish',
  'Organism',
  'Responsible',
  'Quadrant',
  'CommunalCircuit',
  'PointOfInterest'
]

const actions = ['create', 'get', 'edit', 'delete']

const permissions = entities.flatMap((entity) =>
  actions.map((action) => ({
    name: `${action}_${entity.toLowerCase()}`,
    description: `Allows a user to ${action} a ${entity}`,
  }))
)

export type PermissionType =
  `${(typeof actions)[number]}_${Lowercase<(typeof entities)[number]>}`

async function populateAdminAndPermissions() {
  try {
    // 1. Create admin user first
    const [adminUser, userCreated] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        passwordHash: 'admin',
      },
    })

    // 2. Create permissions
    const createdPermissions = await Permission.bulkCreate(permissions, {
      ignoreDuplicates: true,
    })

    // 3. Create admin role
    const [adminRole, roleCreated] = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { description: 'Administrator role with full permissions' },
    })

    // 4. Associate admin role and permissions (many-to-many)
    await adminRole.$set(Role.RELATIONS.PERMISSIONS, createdPermissions, {
    })

    // 5. Associate admin user and admin role (many-to-many)
    await adminUser.$set(User.RELATIONS.ROLES, adminRole)

    if (roleCreated) {
      console.log('Admin role created')
    } else {
      console.log('Admin role already exists')
    }

    if (userCreated) {
      console.log('Admin user created')
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.error('Error populating admin and permissions:', error)
  }
}

export default populateAdminAndPermissions
