const fs = require('fs');
//  const { Sequelize, DataTypes } = require('sequelize');
const Sequelize = require("sequelize");
 const { gte } = Sequelize.Op;
 var pg = require('pg');
 
module.exports = Sequelize;
var sequelize = new Sequelize(
  "frrbnvoi",
  "frrbnvoi",
  "1EeM6FV4i1n2PNPd1weE4n99wTVB0WVJ",
  {
    host: "lallah.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);
//Define a "post" model

// Defining the Post Model
const Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

// Defining the Category Model
const Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

// This will ensure that our Post model gets a "category" column that will act as a foreign key to the Category model
Post.belongsTo(Category, { foreignKey: "category" });

// const Post = require('./models').Post;
//const { sequelize } = require('./models');
//  const { Post } = require('./models');

const initialize = () => {
 return new Promise((resolve, reject) => {
   sequelize
     .sync()
     .then(() => {
       console.log('Database synced successfully.');
       resolve();
     })
     .catch((err) => {
       console.log('Unable to sync the database:', err);
       reject('Unable to sync the database');
     });
 });
};

const getAllPosts = () => {
  console.log("step getAllPosts");
 return new Promise((resolve, reject) => {
   Post.findAll()
     .then(posts => {
       if (posts.length === 0) {
         reject("No posts found");
       } else {
         resolve(posts);
       }
     })
     .catch(err => {
       reject(err);
     });
 });
};

const getPostsByCategory = (category) => {
  console.log("step getPostsByCategory");
 return new Promise((resolve, reject) => {
   Post.findAll({
     where: { category: category }
   })
     .then((posts) => {
       if (posts.length === 0) {
         reject('No results returned');
       } else {
         resolve(posts);
       }
     })
     .catch((err) => {
       console.log('Error retrieving posts by category:', err);
       reject('Error retrieving posts by category');
     });
 });
};

const getPostsByMinDate = (minDateStr) => {
 return new Promise((resolve, reject) => {
   const { gte } = Sequelize.Op;
   const minDate = new Date(minDateStr);

   Post.findAll({
     where: {
       postDate: {
         [gte]: minDate
       }
     }
   }).then((posts) => {
     resolve(posts);
   }).catch((error) => {
     reject("no results returned");
   });
 });
};

const getPostById = (id) => {
  console.log("step getPostById ");
  return Post.findByPk(id)
    .then((post) => {
      if (!post) {
        throw new Error('no result returned');
      }
      // format the postDate property of the post object
      post.postDate = new Date(post.postDate).toISOString().substring(0, 10);
      return post;
    });
};

const addPost = (postData) => {
 postData.published = (postData.published) ? true : false;

 for (let prop in postData) {
   if (postData[prop] === "") {
     postData[prop] = null;
   }
 }
   let dateObj =new Date() ;
 let year = dateObj.getFullYear();
 let month = (dateObj.getMonth() + 1).toString();
 let day = dateObj.getDate().toString();
 postData.postDate=`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
 // new Date().toISOString().slice(0,10);
 console.log( postData.postDate);
 return new Promise((resolve, reject) => {
   Post.create(postData)
     .then(() => {
       resolve("Post created successfully");
     })
     .catch((error) => {if (error.name === 'SequelizeValidationError') {
       reject("Invalid post data");
     } else {
       console.error(error);
       reject("Unable to create post");
     }
   });
 });
};

const addCategory = (categoryData) =>{
 return new Promise((resolve, reject) => {
   for (let i in categoryData) {
     if (categoryData[i] === "") {
       categoryData[i] = null;
     }
   }
   Category.create(categoryData)
     .then((category) => {
       resolve(category);
     })
     .catch(() => {
       reject("unable to create category");
     });
 });
}

const getPublishedPosts = () => {
  console.log("step getPublishedPosts ");
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true
      }
    }).then(posts => {
      // format the postDate property of each post in the desired format
      posts = posts.map(post => {
        post.postDate = new Date(post.postDate).toISOString().substring(0, 10);
        return post;
      });
      resolve(posts);
    }).catch(error => {
      reject("no results returned");
    });
  });
};

  const deletePostById = (id) =>{ 
 return new Promise((resolve, reject) => {
   Post.destroy({
     where: {
       id: id,
     },
   })
     .then(() => {
       resolve("Destroyed");
     })
     .catch(() => {
       reject("Unable to delete post");
     });
 });
}

  const deleteCategoryById= (id) =>{ 
 return new Promise((resolve, reject) => {
   console.log("three step");
   Category.destroy({
     where: {
       id: id,
     },
   })
     .then(() => {
       resolve("Destroyed");
     })
     .catch(() => {
       reject("Unable to delete category");
     });
 });
}


  const getPublishedPostsByCategory= (category) =>{
    console.log("step getPublishedPostsByCategory ");
 return new Promise((resolve, reject) => {
     Post.findAll({
     where: {
       published: true,
       category: category
     }
   })
     .then(posts => {
       resolve(posts);
     })
     .catch(error => {
       reject("no results returned");
     });
 });
};



function getCategories() {
  console.log("step getCategories ");
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
}

module.exports = {
initialize,
getAllPosts,
getPublishedPosts,
getCategories,
deletePostById,
deleteCategoryById,
addPost,
addCategory,
getPostsByCategory,
getPostsByMinDate,
getPostById,
getPublishedPostsByCategory,
 };