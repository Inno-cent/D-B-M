export const PRODUCT_SLUGS: string[]

export const MEAL_KIT_SLUGS: string[]

export const BLOG_SLUGS: string[]

export interface StaticRoute {
  path: string
  priority: number
  changefreq:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
}

export const STATIC_ROUTES: StaticRoute[]

export function allPrerenderRoutes(): string[]