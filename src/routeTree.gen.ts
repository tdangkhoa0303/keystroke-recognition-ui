/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as SignInImport } from './routes/sign-in'
import { Route as authImport } from './routes/__auth'
import { Route as authIndexImport } from './routes/__auth.index'
import { Route as authSettingsImport } from './routes/__auth.settings'

// Create/Update Routes

const SignUpRoute = SignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const SignInRoute = SignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const authRoute = authImport.update({
  id: '/__auth',
  getParentRoute: () => rootRoute,
} as any)

const authIndexRoute = authIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => authRoute,
} as any)

const authSettingsRoute = authSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => authRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/__auth': {
      id: '/__auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof authImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/sign-up': {
      id: '/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    '/__auth/settings': {
      id: '/__auth/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof authSettingsImport
      parentRoute: typeof authImport
    }
    '/__auth/': {
      id: '/__auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authIndexImport
      parentRoute: typeof authImport
    }
  }
}

// Create and export the route tree

interface authRouteChildren {
  authSettingsRoute: typeof authSettingsRoute
  authIndexRoute: typeof authIndexRoute
}

const authRouteChildren: authRouteChildren = {
  authSettingsRoute: authSettingsRoute,
  authIndexRoute: authIndexRoute,
}

const authRouteWithChildren = authRoute._addFileChildren(authRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof authRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/settings': typeof authSettingsRoute
  '/': typeof authIndexRoute
}

export interface FileRoutesByTo {
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/settings': typeof authSettingsRoute
  '/': typeof authIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/__auth': typeof authRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/sign-up': typeof SignUpRoute
  '/__auth/settings': typeof authSettingsRoute
  '/__auth/': typeof authIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/sign-in' | '/sign-up' | '/settings' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '/sign-in' | '/sign-up' | '/settings' | '/'
  id:
    | '__root__'
    | '/__auth'
    | '/sign-in'
    | '/sign-up'
    | '/__auth/settings'
    | '/__auth/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authRoute: typeof authRouteWithChildren
  SignInRoute: typeof SignInRoute
  SignUpRoute: typeof SignUpRoute
}

const rootRouteChildren: RootRouteChildren = {
  authRoute: authRouteWithChildren,
  SignInRoute: SignInRoute,
  SignUpRoute: SignUpRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/__auth",
        "/sign-in",
        "/sign-up"
      ]
    },
    "/__auth": {
      "filePath": "__auth.tsx",
      "children": [
        "/__auth/settings",
        "/__auth/"
      ]
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/__auth/settings": {
      "filePath": "__auth.settings.tsx",
      "parent": "/__auth"
    },
    "/__auth/": {
      "filePath": "__auth.index.tsx",
      "parent": "/__auth"
    }
  }
}
ROUTE_MANIFEST_END */