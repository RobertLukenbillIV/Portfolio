export default function ProjectCard({post}:{post:any}){
return (
<article className="card">
<h2 className="text-xl font-semibold text-mocha">{post.title}</h2>
<p className="opacity-80">{post.excerpt}</p>
{post.coverUrl && <img src={post.coverUrl} alt="cover" className="mt-3 rounded-xl"/>}
</article>
)
}