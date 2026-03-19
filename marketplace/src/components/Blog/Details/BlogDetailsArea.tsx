import BlogCommentForm from "@/components/Form/BlogCommentForm";
import BlogDetailsSidebar from "./Sidebar/BlogDetailsSidebar";
import PostboxDetailsText from "./PostboxDetailsText";
import { CircleCheckSvgTwo } from "@/components/SVG";
import BlogDetailsAuthor from "./BlogDetailsAuthor";
import { IdProps } from "@/types/custom-interface";
import BlogComments from "./BlogComments";
import PostboxQuote from "./PostboxQuote";
import BlogPostTag from "./BlogPostTag";
import blogData from "@/data/blogData";

export default function BlogDetailsArea({ id }: IdProps) {
   // Find the blog post by ID from the blogData array
   const blog = blogData.find((blog) => blog.id == id);

   return (
      <section className="tp-blog-details-ptb pt-140 pb-120">
         <div className="container">
            <div className="row">
               <div className="col-lg-8">
                  <div className="tp-postbox-wrapper">
                     <div className="tp-postbox-details-text mb-60">
                        <h3 className="tp-postbox-details-title">{blog?.title}</h3>
                        <p className="tp-dropcap text-1">While you want your sales team to be spending most of their time prospecting and selling, making sure they have the time and space to keep the CRM up to date is critical. Remember to factor in time for these tasks when setting goals and benchmarks for them. Provide sales support where you can to ensure your sales team is spending.</p>

                        <p className="text-2">Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved.!</p>

                        <div className="tp-postbox-details-list">
                           <ul>
                              <li><span><CircleCheckSvgTwo /></span>Say goodbye to bank fees.</li>
                              <li><span><CircleCheckSvgTwo /></span>Leverage agile frameworks to provide</li>
                              <li><span><CircleCheckSvgTwo /></span>Capitalize on low hanging fruit</li>
                              <li><span><CircleCheckSvgTwo /></span>Deposit funds easily, securely.</li>
                           </ul>
                        </div>
                     </div>

                     {/* postbox details text */}
                     <PostboxDetailsText />

                     {/* Postbox quote */}
                     <PostboxQuote />

                     <div className="tp-postbox-details-text">
                        <p className="text-5">Ex erat referrentur vis. Vim ad consul molestie, eu malorum aliquando referrentur pro, erroribus gloriatur sed at. Eu illud saepe impetus ius. Cum graece libris abhorreant id, eu veri aeque ubique vel. Ut his malis similique. Ei vim blandit nominavi, quo elaboraret quaerendum et. At animal fabellas pericula est, ut cibo lobortis delicatissimi vel, cum ex putant probatus petentium. Elitr laboramus mel id. Admodum adolescens id eam, omnes reformidans comprehensam no vim, ex omnes alienum liberavisse usu. Mandamus tincidunt cu pro, vocent corrumpit no per. Vis ad malorum tacimates adipiscing. Elitr laboramus mel id.</p>
                     </div>

                     {/* blog post tags */}
                     <BlogPostTag />

                     {/* blog author  */}
                     <BlogDetailsAuthor />

                     {/* blog comments */}
                     <BlogComments />

                     <div className="tp-property-details-box box-9 mb-30">
                        <h3 className="tp-property-details-box-title">Post your comment</h3>
                        <div className="tp-property-details-review">
                           {/* Render comment form in review section */}
                           <BlogCommentForm />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-4">
                  {/* Render BlogDetailsSidebar in a column */}
                  <BlogDetailsSidebar />
               </div>
            </div>
         </div>
      </section>
   )
}