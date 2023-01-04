import create from 'zustand'
import { immer } from './middleware'

const navigationStore = (state) => ({
  mobileMenuIsOpen: false,
  setMobileMenu: (boolean) => {
    state.mobileMenuIsOpen = boolean;
  },
  navItems: [
    {
      name: 'home',
      slug: '/',
      shownInProjects: false,
      shownOnHome: false,
    },
    {
      name: 'projects',
      slug: '/projects',
      shownInProjects: true,
      shownOnHome: true,
    },
    {
      name: 'about us',
      slug: '/about',
      shownInProjects: true,
      shownOnHome: true,
    },
    {
      name: 'contact',
      slug: '/contact',
      shownInProjects: true,
      shownOnHome: true,
    },
    {
      name: 'imprint',
      slug: '/imprint',
      shownInProjects: false,
      shownOnHome: true,
    },
    {
      name: 'data policy',
      slug: '/datapolicy',
      shownInProjects: false,
      shownOnHome: false,
    },
  ],
})

export const useNavigationStore = create(immer(navigationStore))
