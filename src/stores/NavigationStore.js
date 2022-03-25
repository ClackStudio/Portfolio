import create from "zustand";
import { immer } from './middleware'

const navigationStore = state => ({
    navItems: [
        {
            name: 'home',
            slug: '/',
            shownInProjects: true,
            shownOnHome: false
        },
        {
            name: 'about us',
            slug: '/about',
            shownInProjects: true,
            shownOnHome: true
        },
        {
            name: 'projects',
            slug: '/projects',
            shownInProjects: true,
            shownOnHome: true
        },
        {
            name: 'contact',
            slug: '/contact',
            shownInProjects: true,
            shownOnHome: true
        },
        {
            name: 'imprint',
            slug: '/imprint',
            shownInProjects: false,
            shownOnHome: true
        },
        {
            name: 'data policy',
            slug: '/datapolicy',
            shownInProjects: false,
            shownOnHome: true
        },
    ]

});

export const useNavigationStore = create(immer(navigationStore));
