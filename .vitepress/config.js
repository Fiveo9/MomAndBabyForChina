import { defineConfig } from 'vitepress'

import lightbox from "vitepress-plugin-lightbox";
import tablePlugin from './plugins/table-plugin.js';

export default defineConfig({
  title: '孕期指南',
  description: '妈妈和宝宝的全面指南',
  srcDir: 'pages',
  outDir: 'dist',
  base: '/',
  head: [
    ['meta', { name: 'keywords', content: '孕期指南,妈妈宝宝,待产准备,产后恢复,新生儿护理,母婴用品,哺乳指南,婴儿护理,孕妇健康,宝宝成长,儿保疫苗,安全座椅,婴儿推车,新生儿注意事项,过敏症状,病症护理' }],
    ['meta', { name: 'author', content: 'Fiveonine' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:title', content: '孕期指南 - 妈妈和宝宝的全面指南' }],
    ['meta', { property: 'og:description', content: '专业的孕期指南，涵盖备孕产检、待产准备、产后恢复、新生儿护理、母婴用品选择等全方位内容。' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: '/images/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '孕期指南 - 妈妈和宝宝的全面指南' }],
    ['meta', { name: 'twitter:description', content: '专业的孕期指南，涵盖备孕产检、待产准备、产后恢复、新生儿护理、母婴用品选择等全方位内容。' }],
    ['meta', { name: 'twitter:image', content: '/images/logo.svg' }],
    ['link', { rel: 'icon', href: '/pages/images/logo.png' }],
    ['link', { rel: 'canonical', href: 'https://mom-and-baby.pages.dev/' }]
  ],
  themeConfig: {
    logo: '/pages/images/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '孕期', link: '/P00-孕期总览' },
      { text: '待产准备', link: '/00-待产证件资料' },
      { text: '产后指南', link: '/03-妈妈产后恢复指南' },
      { text: '新生儿护理', link: '/06-新生儿常见过敏原与过敏症状' },
      { text: '母婴用品', link: '/11-0-奶粉' },
      { text: '参考资料', link: '/90-参考资料' },
    ],
    sidebar: [
      {
        text: '孕期指南',
        items: [
          { text: '孕期总览', link: '/P00-孕期总览' },
          { text: '备孕与孕早期', link: '/P01-备孕与孕早期' },
          { text: '建档与产检时间表', link: '/P02-建档与产检时间表' },
          { text: '营养体重与补充剂', link: '/P03-营养体重与补充剂' },
          { text: '常见不适与红旗信号', link: '/P04-常见不适与红旗信号' },
          { text: '孕晚期与分娩准备', link: '/P05-孕晚期与分娩准备' }
        ]
      },
      {
        text: '待产准备',
        items: [
          { text: '待产证件资料', link: '/00-待产证件资料' },
          { text: '妈妈待产&住院包', link: '/01-妈妈待产&住院包' },
          { text: '宝宝待产&住院包', link: '/02-宝宝待产&住院包' }
        ]
      },
      {
        text: '产后指南',
        items: [
          { text: '妈妈产后恢复指南', link: '/03-妈妈产后恢复指南' },
          { text: '哺乳指南', link: '/03-1-哺乳指南' },
          { text: '宝宝居家成长指南', link: '/04-宝宝居家成长指南' },
          { text: '宝宝儿保与疫苗', link: '/05-宝宝儿保与疫苗' }
        ]
      },
      {
        text: '新生儿护理',
        items: [
          { text: '新生儿常见过敏原与过敏症状', link: '/06-新生儿常见过敏原与过敏症状' },
          { text: '新生儿常见病症及注意事项', link: '/07-新生儿常见病症及注意事项' },
          { text: '新生儿注意事项', link: '/10-新生儿注意事项' }
        ]
      },
      {
        text: '母婴用品',
        items: [
          { text: '婴幼儿奶粉', link: '/11-0-奶粉' },
          { text: '婴幼儿奶粉（2段详细比较）', link: '/11-0-1-奶粉（2 段）' },
          { text: '安全座椅', link: '/11-1-安全座椅' },
          { text: '婴儿推车', link: '/11-2-婴儿推车' },
          { text: '母婴用品相关资料', link: '/12-母婴用品相关资料' },
          { text: '常见品牌与价格', link: '/20-常见品牌与价格' }
        ]
      },
      {
        text: '育儿优惠政策',
        link: '/80-育儿优惠政策'
      },
      {
        text: '参考资料',
        link: '/90-参考资料'
      }
    ],
    aside: true,
    outline: {
      level: [1, 4],
      label: '本页目录'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Fiveo9/MomAndBabyForChina' }
    ]
  },
  markdown: {
    config: (md) => {
      // Use lightbox plugin
      md.use(lightbox, {});
      // Use custom table plugin
      md.use(tablePlugin);
    },
  },
})
