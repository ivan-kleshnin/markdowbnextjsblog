import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'
import ItemPost from '../../components/ItemPost'
import { slugify, ImageUrl } from '../../utils'
import { NextSeo } from 'next-seo';

export default function tag({posts}) {
  return <>
    <NextSeo
      title= 'Access your tag realted articles'
      description= 'Access your tag realted articles'
      openGraph={{
        url: 'https://officialrajdeepsingh.dev',
        title: 'Access your tag realted articles',
        description: 'Access your tag realted articles',

        images: [
          {
            url: `${ImageUrl('banner.png')}`,
            width: 1224,
            height: 724,
            alt: 'banner',
            type: 'image/jpeg',
          },
        ],
        site_name: 'Rajdeep Singh',
      }}
    />

    <div className="container my-3">
      <div className="row">
        <div className="col-lg-10 post-date m-1 p-2m-auto">
          {posts.map((post, index) =>
            <ItemPost key={index} post={post}/>
          )}
        </div>
      </div>
    </div>
  </>
}


export async function getStaticPaths() {
  const files = fs.readdirSync(path.resolve("content2", "blog"))

  let tempStorage = []

  const temppaths = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.resolve("content2", "blog", filename),
      'utf-8'
    )

    const {data} = matter(markdownWithMeta)

    data.tags.map(tag => {
      tempStorage.push({params: {slug: slugify(tag)}})
    })
  })

  const paths = tempStorage.filter((item,
    index) => {
    return tempStorage.indexOf(item) === index
  })

  // const paths=["npm"]

  return {
    paths,
    fallback: false,
  }

}

export async function getStaticProps({ params: { slug } }) {

  // Get files from the posts dir
  const files = fs.readdirSync(path.resolve("content2", "blog"))

  let tempStorage = []



  // Get slug and frontmatter from posts

  const tempPosts = files.map((filename) => {

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.resolve("content2", "blog", filename),
      'utf-8'
    )

    const { data: frontmatter } = matter(markdownWithMeta)

    frontmatter.tags.map(
      tag => {
        let tagSlug = slugify(tag)
        if (slug === tagSlug) {
          tempStorage.push({ post: frontmatter })
        }
      }
    )
  })

  //  remove null in tempPosts

  const posts = tempStorage.filter(
    post => {

      return post && post
    }
  )

  return {
    props: {
      posts
    },
  }


}
