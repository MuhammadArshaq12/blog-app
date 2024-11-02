// Sidebar.jsx
'use client';
import { assets } from '@/Assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '@/Components/css/Sidebar.module.css';

const Sidebar = () => {
    // Track active menu item
    const [activeItem, setActiveItem] = useState('');

    // Menu items data
    const menuItems = [
        { id: 1, path: '/admin/addBlog', icon: assets.add_icon, label: 'Add blogs' },
        { id: 2, path: '/admin/addCategory', icon: assets.add_icon, label: 'Add Category' },
        { id: 3, path: '/admin/addAds', icon: assets.add_icon, label: 'Add Ads' },
        { id: 4, path: '/admin/adsList', icon: assets.blog_icon, label: 'Ads lists' },
        { id: 5, path: '/admin/blogList', icon: assets.blog_icon, label: 'Blog lists' },
        { id: 6, path: '/admin/categoryList', icon: assets.category_icon, label: 'Category List' },
        { id: 7, path: '/admin/userList', icon: assets.group_icon, label: 'User List' },
        { id: 8, path: '/admin/commentList', icon: assets.comment_icon, label: 'Comments List' },
        { id: 9, path: '/admin/subscriptions', icon: assets.email_icon, label: 'Subscriptions' }
    ];

    return (
        <aside className={styles.sidebar}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <Image 
                    src={assets.logo} 
                    width={120} 
                    height={40} 
                    alt="Logo" 
                    className={styles.logo}
                />
            </div>

            {/* Navigation Menu */}
            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={`${styles.menuItem} ${
                            activeItem === item.path ? styles.active : ''
                        }`}
                        onClick={() => setActiveItem(item.path)}
                    >
                        <div className={styles.iconContainer}>
                            <Image 
                                src={item.icon} 
                                width={24} 
                                height={24} 
                                alt={item.label}
                            />
                        </div>
                        <span className={styles.menuLabel}>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;