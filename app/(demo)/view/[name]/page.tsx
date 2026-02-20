import type { Metadata } from "next"

import { registry } from "@/demo/registry"

export default async function Page({
  params,
}: PageProps<"/view/[name]">) {
  const { name } = await params
  const { Component } = registry[name]

  return (
    <Component />
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/view/[name]">): Promise<Metadata> {
  const { name } = await params
  const { metadata } = registry[name]

  return metadata
}

export async function generateStaticParams() {
  return Object.keys(registry).map((name) => ({
    name,
  }))
}

