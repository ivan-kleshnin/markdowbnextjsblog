// import fs from "fs"
// import path from "path"
import parseFM from "gray-matter"
import { marked } from "marked"
import Link from "next/link"
import {slugify, ImageUrl} from "../../utils"
import {NextSeo} from "next-seo"

export default function PostPage({post}) {
  const date = new Date(post.date)
  const imageMeta = post.images.map(image => {
     const imageUrl = ImageUrl(image)
      return {
      url: imageUrl,
      width: 1224,
      height: 724,
      alt: post.title,
      type: "image/jpeg",
    }
  })

  return <>
    <NextSeo
      title={post.title}
      description={post.summary}
      openGraph={{
        url: "https:officialrajdeepsingh.dev",
        title: post.title,
        description: post.summary ,
        type: "article",
        article: {
          publishedTime: post.date,
          authors: [
            "https://officialrajdeepsingh.dev/pages/about",
          ],
          tags: post.tags,
        },
        images: imageMeta,
        site_name: "Rajdeep Singh",
      }}
    />
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-10 m-auto">
          <div className="card card-page">
            <a href={`/blog/${post.slug}`} > <img className="card-img-top" src={ImageUrl(post.image)} alt="..." /></a>

            <h1 className="post-title mt-2 p-2">{post.title}</h1>
            <div className="post-date m-1 p-2">
              <div>
                <h6>{`${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`} </h6>
              </div>
              <div>
                {post.tags.map(tag => {
                  const slug = slugify(tag)
                  return <Link key={tag} href={`/tag/${slug}`}>
                    <a className="btn">
                      <h6 className="post-title">#{tag}</h6>
                    </a>
                  </Link>
                })}
              </div>
            </div>

            <div
              className="post-body p-5 m-auto"
              dangerouslySetInnerHTML={{__html: marked.parse(post.content)}}
            />
          </div>
        </div>
      </div>
    </div>
  </>
}

// TODO apply marked on BE!

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export async function getStaticProps({params}) {
  const fs = await import("fs").then(m => m.default)
  const path = await import("path").then(m => m.default)

  const {slug} = params

  console.log("process.cwd():", fs.readdirSync(process.cwd()))
  console.log("./", fs.readdirSync(path.resolve("./")))

  const post = readFM(path.resolve("content", "blog", slug + ".md"))
  console.log(post)

  const post2 = readFM(path.resolve("content2", "blog", slug + ".md"))
  console.log(post2)

  const _x = path.resolve("content3", "blog", slug + ".md")

  const _y = path.resolve("content4")

  return {
    props: {
      post,
    },
  }
}

function readFM(file) {
  const fm = fs.readFileSync(file, "utf-8")
  const slug = path.basename(file).replace(/.md$/, "")
  const {data, content} = parseFM(fm)
  return {
    ...data, content, slug
  }
}

// export async function getStaticPaths() {
//   // console.log("process.cwd():", fs.readdirSync(process.cwd()))
//   // console.log("./content", fs.readdirSync(path.resolve("./content")))
//   //
//   // //  Get files from the posts dir
//   // const files = fs.readdirSync(path.resolve("content2", "blog"))
//   //
//   //  // Get slug and frontmatter from posts
//   // const temppaths = files.map((filename) => {
//   //
//   //   // Get frontmatter
//   //   const markdownWithMeta = fs.readFileSync(
//   //     path.join("content2", "blog", filename),
//   //     "utf-8"
//   //   )
//   //
//   //   const {data} = matter(markdownWithMeta)
//   //
//   //   return {
//   //     params: {
//   //       slug: filename.replace(".md", ""),
//   //     },
//   //   }
//   // })
//   // //   remove null in tempPosts
//   // const paths = temppaths.filter(
//   //   path => {
//   //     return path && path
//   //   }
//   // )
//
//   return {
//     paths: [],
//     fallback: "blocking", // false,
//   }
// }
