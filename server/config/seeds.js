const db = require('./connection');
const { User, Product, Category } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Category', 'categories');
    await cleanDB('Product', 'products');
    // await cleanDB('User', 'users');

    const categories = await Category.insertMany([
      { name: 'Food' },
      { name: 'Household Supplies' },
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Toys' },
      { name: 'Clothing' },
      { name: 'Furniture' },
      { name: 'Beauty & Personal Care' },
      { name: 'Sports & Outdoors' },
      { name: 'Automotive' },
      { name: 'Health & Wellness' },
      { name: 'Office Supplies' },
      { name: 'Pet Supplies' },
      { name: 'Garden & Outdoor' },
      { name: 'Music' },
      { name: 'Movies & TV' },
      { name: 'Video Games' },
      { name: 'Jewelry' },
      { name: 'Shoes' },
      { name: 'Tools & Home Improvement' }
    ]);

    console.log('categories seeded');

    const products = await Product.insertMany([
        {
            name: 'Tin of Cookies',
            description:
                'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
            image: 'https://via.placeholder.com/150',
            category: categories[0]._id,
            price: 2.99,
            quantity: 500,
            zipcode: '90210',
            user:'66b6626a8f6e9e78d5eac76a'
        },
        {
            name: 'Canned Coffee',
            description:
                'Praesent sed lacinia mauris. Nulla congue nibh magna, at feugiat nunc scelerisque quis. Donec iaculis rutrum vulputate. Suspendisse lectus sem, vulputate ac lectus sed, placerat consequat dui.',
            image: 'https://via.placeholder.com/150',
            category: categories[0]._id,
            price: 1.99,
            quantity: 500,
            zipcode: '32839',
            user:'66b6626a8f6e9e78d5eac76a'
        },
      ]);

    console.log('products seeded');

    // await User.create({
    //   firstName: 'Pamela',
    //   lastName: 'Washington',
    //   email: 'pamela@testmail.com',
    //   password: 'password12345',
    //   orders: [
    //     {
    //       products: [products[0]._id, products[0]._id, products[1]._id]
    //     }
    //   ]
    // });

    // await User.create({
    //   firstName: 'Elijah',
    //   lastName: 'Holt',
    //   email: 'eholt@testmail.com',
    //   password: 'password12345'
    // });

    // console.log('users seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});