const { Blog, User } = require("../models");
const express = require("express");
const { Op } = require("sequelize");
const { userExtractor } = require("../util/middleware");
const router = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }

  const blogs = await Blog.findAll({
    where,
    include: {
      model: User,
      attributes: ["name", "username"],
    },
    order: [["likes", "DESC"]],
  });
  return res.status(200).json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  return res.status(200).json(req.blog);
});

router.post("/", userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    const { author, url, title, likes } = req.body;
    await req.blog.update({ author, url, title, likes });

    return res.status(200).json(req.blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", userExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "only the owner can delete this blog" });
  }

  await req.blog.destroy();
  res.status(204).end();
});

module.exports = router;
