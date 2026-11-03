"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
export type RelatedResource={title:string;description:string;href:string;type:string;id?:string};
export default function RelatedResources({resources,title}:{resources:RelatedResource[];title?:string}){const { t } = useLanguage();const heading = title ?? t("materials.related");if(!resources.length)return null;return <section className="related-resources"><h2>{heading}</h2><div className="app-link-grid">{resources.map((item,index)=><Link className="app-link-card" href={item.href} key={`${item.type}-${item.id}`}><span className="app-link-number">{String(index+1).padStart(2,"0")}</span><span><small className="related-type">{item.type}</small><b>{item.title}</b><small>{item.description}</small></span><b aria-hidden="true">↗</b></Link>)}</div></section>;}
