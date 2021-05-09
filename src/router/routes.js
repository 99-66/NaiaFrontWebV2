
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
        path: '/related-word',
        component: () => import('pages/RelatedWord'),
        name: 'Related Word'
      },
      {
        path: '/about',
        component: () => import('pages/About'),
        name: 'About'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
