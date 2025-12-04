/*
|--------------------------------------------------------------------------
| routers file
|--------------------------------------------------------------------------
|
| The routers file is used for defining the HTTP routers.
|
*/

const TablesController = () => import('#controllers/tables_controller')
const MenuController = () => import('#controllers/menu_controller')
const AuthController = () => import('#controllers/auth_controller')
const CashiersController = () => import('#controllers/cashiers_controller')
import OrdersController from '#controllers/orders_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import KitchensController from '#controllers/kitchens_controller'
import PaymentsController from '#controllers/payments_controller'
import CostumersController from '#controllers/costumers_controller'
import CostumerPagesController from '#controllers/costumer_pages_controller'
import DashboardController from '#controllers/dashboard_controller'

router.get('/login', [AuthController, 'login'])
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/dashboard', [DashboardController, 'dashboard'])

    router
      .group(() => {
        router.get('/', [TablesController, 'index'])
        router.get('details/:id', [TablesController, 'show'])
        router
          .group(() => {
            router.get('/', [TablesController, 'store'])
            router.post('/', [TablesController, 'store'])
          })
          .prefix('/create')
        router
          .group(() => {
            router.get('/', [TablesController, 'update'])
            router.post('/', [TablesController, 'update'])
          })
          .prefix('/update/:id')
        router.delete('/delete/:id', [TablesController, 'delete'])
      })
      .prefix('table')

    router
      .group(() => {
        router.get('/', [MenuController, 'index'])
        router.get('details/:id', [MenuController, 'show'])
        router
          .group(() => {
            router.get('/', [MenuController, 'store'])
            router.post('/', [MenuController, 'store'])
          })
          .prefix('/create')
        router
          .group(() => {
            router.get('/', [MenuController, 'update'])
            router.post('/', [MenuController, 'update'])
          })
          .prefix('/update/:id')
        router.delete('/delete/:id', [MenuController, 'delete'])

        router
          .group(() => {
            router
              .group(() => {
                router.get('/', [MenuController, 'storeCategories'])
                router.post('/', [MenuController, 'storeCategories'])
              })
              .prefix('/create')
            router
              .group(() => {
                router.get('/', [MenuController, 'updateCategories'])
                router.post('/', [MenuController, 'updateCategories'])
              })
              .prefix('/update/:id')
            router.get('/:id', [MenuController, 'showByCategories'])
            router.delete('/delete/:id', [MenuController, 'deleteCategories'])

            router.post('/:id/move-up', [MenuController, 'moveUp'])
            router.post('/:id/move-down', [MenuController, 'moveDown'])
          })
          .prefix('categories')
      })
      .prefix('menu')

    router
      .group(() => {
        router
          .group(() => {
            router.get('/', [CashiersController, 'index'])
            router
              .group(() => {
                router.get('/:id', [CashiersController, 'showByCategories'])
              })
              .prefix('categories')
            router.group(() => {
              router.post('/start', [OrdersController, 'start'])
              router.get('/start', [OrdersController, 'start'])
              router.get('/:id', [OrdersController, 'show'])
              router.post('/add-item', [OrdersController, 'addItem'])
              router.post('/update-qty', [OrdersController, 'updateQty'])
              router.post('/delete-item', [OrdersController, 'deleteItem'])
              router.post('/place-order/:id', [OrdersController, 'placeOrder'])
              router.post('/pay', [OrdersController, 'pay'])
            })
          })
          .prefix('order')
        router.post('/payments', [PaymentsController, 'create'])
        router.post('/session/:sessionToken/end', [OrdersController, 'endSession'])
      })
      .prefix('cashier')

    router
      .group(() => {
        router.get('/kot', [KitchensController, 'index'])
        router.post('/kot/:id/status', [KitchensController, 'updateKotStatus'])
        router.post('/order-item/:id/status', [OrdersController, 'updateItemStatus'])
        router.get('/kot/categories/:id', [KitchensController, 'show'])
      })
      .prefix('kitchen')

    router.on('/cashier').redirect('/cashier/order')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.post('/session/:sessionToken/add-item', [CostumersController, 'addItem'])
    router.post('/session/:sessionToken/update-qty', [CostumersController, 'updateQty'])
    router.post('/session/:sessionToken/delete-item', [CostumersController, 'deleteItem'])
    router.post('/session/:sessionToken/place-order', [CostumersController, 'placeOrder'])
    router.get('/session/:sessionToken', [CostumerPagesController, 'index'])
    router.get('/session/:sessionToken/cart', [CostumerPagesController, 'cart'])
    router.get('/session/:sessionToken/order', [CostumerPagesController, 'order'])
    router.get('/session/:sessionToken/categories/:id', [
      CostumerPagesController,
      'showByCategories',
    ])
  })
  .prefix('/order')

router.on('/').redirect('/dashboard')
