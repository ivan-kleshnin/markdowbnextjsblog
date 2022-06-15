import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextSeo } from 'next-seo';
import Post from '../components/Post'
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar"
import { sortByDate, slugify,ImageUrl} from '../utils'

export default function Home({ posts }) {
  return (
    <div>
      <NextSeo
        title="Welcome to my blog home page"
        description="Build nextjs blog website with Markdown, sitemap, serachbar, category, tag and SEO support"
        openGraph={{
          url: 'http://officialrajdeepsingh.dev',
          title: 'Welcome to my blog home page',
          description: 'Build nextjs blog website with Markdown, sitemap, serachbar, category, tag and SEO support',
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
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <pre>
              <code>{JSON.stringify(posts, null, 2)}</code>
            </pre>
            {posts.map((post, i) => {
              // console.log(post)
              return null
              // <Post key={i} post={post} />
            })}
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  console.log("LS process.cwd():", fs.readdirSync(process.cwd()))
  console.log("LS ./", fs.readdirSync(path.resolve("./")))

  // Get files from the posts dir
  const files = await fs.readdirSync(path.resolve("content", "blog"))

  console.log('files:', files)

  // Get slug and frontmatter from posts
  const tempPosts = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '')

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.resolve("content", "blog", filename),
      'utf-8'
    )

    const {data} = matter(markdownWithMeta)

    return {
      slug,
      ...data,
    }
  })

  //  remove null in tempPosts
  const posts = tempPosts.filter(
    post => {
      return post && post
    }
  )
  const jsonString = JSON.stringify(posts)
  fs.writeFileSync('./search.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})

  return {
    props: {
      posts: posts.sort(sortByDate),
    },
  }


}



