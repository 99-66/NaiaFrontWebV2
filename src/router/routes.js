
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Main.vue'),
        name: 'Main'
      },
      {
        path: '/about',
        component: () => import('pages/About'),
        name: 'About'
      }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
