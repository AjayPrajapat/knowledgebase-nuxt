import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface NavNode {
  id: string
  label: string
  description?: string
  children?: NavNode[]
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const baseTree: NavNode[] = [
  {
    id: 'business',
    label: 'Business',
    description: 'Executive decisions, company vision, commercial strategy and KPI scorecards.',
    children: [
      { id: 'business-strategy', label: 'Strategy Playbooks' },
      { id: 'business-finance', label: 'Finance & Forecasts' }
    ]
  },
  {
    id: 'brand',
    label: 'Brand',
    description: 'Brand identity, tone of voice, storytelling frameworks and visual guidelines.'
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Engineering standards, reference architectures, SDK documentation and runbooks.',
    children: [
      { id: 'technical-architecture', label: 'Architecture Diagrams' },
      { id: 'technical-runbooks', label: 'Ops Runbooks' }
    ]
  },
  {
    id: 'product',
    label: 'Product',
    description: 'Product vision, positioning, release notes, feature specs and roadmaps.'
  },
  {
    id: 'process',
    label: 'Process',
    description: 'Standard operating procedures, onboarding checklists and audit-ready SOPs.',
    children: [
      { id: 'process-sop', label: 'SOP Library' },
      { id: 'process-onboarding', label: 'Onboarding Journeys' }
    ]
  },
  {
    id: 'project',
    label: 'Project',
    description: 'Project kickoffs, delivery templates, retrospectives and milestone reviews.'
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Security policies, incident response plans, vulnerability disclosures and compliance packs.'
  },
  {
    id: 'client',
    label: 'Client',
    description: 'Client onboarding kits, QBR decks, support playbooks and case studies.'
  },
  {
    id: 'hr',
    label: 'HR',
    description: 'People operations, hiring plans, performance reviews and wellbeing programs.'
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    description: 'General knowledge articles, FAQs, tribal knowledge capture and best practices.'
  }
]

const brandCatalog = ['Acme Global', 'Northwind Studios', 'Sierra Ventures']
const productCatalog = ['Atlas Platform', 'Nova API', 'Pulse Mobile Suite']

const cloneNode = (node: NavNode): NavNode => ({
  ...node,
  children: node.children ? node.children.map((child) => cloneNode(child)) : undefined
})

export const useNavigationStore = defineStore('navigation', () => {
  const brands = ref(
    brandCatalog.map((brand) => ({
      id: `brand:${slugify(brand)}`,
      label: brand,
      description: `${brand} brand assets, messaging and launch kits.`
    }))
  )

  const products = ref(
    productCatalog.map((product) => ({
      id: `product:${slugify(product)}`,
      label: product,
      description: `${product} product specs, roll-out plans and go-live guides.`
    }))
  )

  const tree = computed(() =>
    baseTree.map((node) => {
      const cloned = cloneNode(node)
      if (cloned.id === 'brand') {
        cloned.children = [...(cloned.children || []), ...brands.value.map((brand) => ({ ...brand }))]
      }
      if (cloned.id === 'product') {
        cloned.children = [...(cloned.children || []), ...products.value.map((product) => ({ ...product }))]
      }
      return cloned
    })
  )

  const flatten = (nodes: NavNode[]): NavNode[] =>
    nodes.flatMap((node) => [node, ...(node.children ? flatten(node.children) : [])])

  const allNodes = computed(() => flatten(tree.value))

  const defaultCategoryId = computed(() => 'knowledge')

  const categoryOptions = computed(() =>
    allNodes.value.map((node) => ({ value: node.id, label: node.label }))
  )

  const selectedCategoryId = ref(defaultCategoryId.value)

  const findById = (id?: string | null) =>
    allNodes.value.find((node) => node.id === id) || allNodes.value.find((node) => node.id === defaultCategoryId.value)

  const selectedCategory = computed(() => findById(selectedCategoryId.value))

  const setSelectedCategory = (id: string) => {
    selectedCategoryId.value = id
  }

  return {
    tree,
    brands,
    products,
    categoryOptions,
    selectedCategoryId,
    selectedCategory,
    findById,
    setSelectedCategory,
    defaultCategoryId
  }
})
