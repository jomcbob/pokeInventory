
function renderIndex(req, res) {
  res.render("pageTwo", { title: "Route Three Index" });
}

module.exports = {
  renderIndex,
};