import getAllProducts from '@/lib/get-all-products'
import getPageData from '@/lib/get-page-data'
import ProductGrid from '@/components/product-grid'
import HeroBanner from '@/components/HeroBanner'

function IndexPage({ products }) {
  return (
    <>
  <HeroBanner />
  <ProductGrid products={products} />
  </>
  )
}

export async function getStaticProps({ locale }) {
  const pageData = await getPageData({ locale })
  const { products } = await getAllProducts({ locale })

  return {
    props: { ...pageData, products }
  }
}

export default IndexPage
