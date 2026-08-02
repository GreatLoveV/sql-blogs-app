require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const express = require("express");

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  },
);

Blog.sync();

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll({});
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    return res.status(200).json(blog);
  } else {
    return res.status(404).end();
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const { author, url, title, likes } = req.body;
    await blog.update({ author, url, title, likes });

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await blog.destroy();

    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
