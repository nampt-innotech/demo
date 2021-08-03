// @flow
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";

export default function Post({ postData }) {
  const router = useRouter();
  if (router.isFallback) return <h1>Loading...</h1>;
  // if (!postData) return <h1>Empty page</h1>;
  return (
    <Layout home={false}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
      </article>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps(data: GetStaticPropsContext) {
  console.log("parrams: ", data.params.id);
  const postData = await getPostData(data.params.id as string);
  if (!postData) return { notFound: true };
  return {
    props: {
      postData,
    },
    revalidate: 30,
  };
}
