import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
    return (
        <div className='flex flex-col bg-slate-100'>
            <div className='px-2 sm:pl-14 py-3 border border-black'>
                <Image src={assets.logo} width={120} alt='' />
            </div>
            <div className='w-28 sm:w-80 h-[100vh] relative py-12 border border-black'>
                <div className='w-[50%] sm:w-[80%] absolute right-0'>
                    <Link href='/admin/addBlog' className='flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.add_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Add blogs</p>
                    </Link>
                    <Link href='/admin/addCategory' className='mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.add_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Add Category</p>
                    </Link>
                    <Link href='/admin/addAds' className='mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.add_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Add Ads</p>
                    </Link>
                    <Link href='/admin/adsList' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.blog_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Ads lists</p>
                    </Link>
                    <Link href='/admin/blogList' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.blog_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Blog lists</p>
                    </Link>
                    <Link href='/admin/categoryList' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.category_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Category List</p>
                    </Link>
                    <Link href='/admin/userList' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.group_icon} alt='' width={28} /><p className='hidden sm:inline-block'>User List</p>
                    </Link>
                    <Link href='/admin/commentList' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.comment_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Comments List</p>
                    </Link>
                    <Link href='/admin/subscriptions' className=' mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                        <Image src={assets.email_icon} alt='' width={28} /><p className='hidden sm:inline-block'>Subscriptions</p>
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default Sidebar
