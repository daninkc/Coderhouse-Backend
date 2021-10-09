const express = require("express");
const fs = require('fs');
const app = express();
const PORT = 8080;

class Contenedor {
  constructor(filename) {
    this.filename = filename;
  }
  save(obj) {
    try {
      const data = JSON.parse(fs.readFileSync(this.filename, "utf-8"));
      if (data.length === 0) {
        obj.id = 1;
        fs.appendFileSync(this.filename, JSON.stringify(obj));
        return obj.id;
      } else {
        let lastIdCreated = data[data.length - 1].id;
        obj.id = lastIdCreated + 1;
        data.push(obj);
        fs.writeFileSync(this.filename, JSON.stringify(data), "UTF-8");
        return obj.id;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          obj.id = 1;
          const newObjectList = [obj];
          fs.writeFileSync(
            this.filename,
            JSON.stringify(newObjectList),
            "UTF-8"
          );
          return obj.id;
        } catch (error) {
          throw error;
        }
      }
      throw error;
    }
  }
  getById(selectedId) {
    try {
      const data = JSON.parse(fs.readFileSync(this.filename, "UTF-8")).filter(
        (item) => item.id === selectedId
      );
      if (data.length === 0) {
        return null;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  }
  getAll() {
    try {
      const data = JSON.parse(fs.readFileSync(this.filename, "UTF-8"));
      return data;
    } catch (error) {
      throw error;
    }
  }
  deleteById(idToDelete) {
    try {
      const content = this.getAll().filter((item) => item.id !== idToDelete);
      fs.writeFileSync(this.filename, JSON.stringify(content), "UTF-8");
    } catch (error) {
      throw error;
    }
  }
  deleteAll() {
    try {
      fs.writeFileSync(this.filename, "[]", "UTF-8");
    } catch (error) {
      throw error;
    }
  }
};

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
server.on("error", (error) => console.log(`Error en el servidor: ${error}`));

const file = "./productos.txt";
const productosCarniceria = new Contenedor(file);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get("/productos", (req, res) => {
  const products = productosCarniceria.getAll();
  res.status(200).send(products);
});

app.get("/productoRandom", (req, res) => {
    let allProducts = productosCarniceria.getAll();
    const randomIndex = getRandomInt(0, allProducts.length++);
    const randomProduct = allProducts[randomIndex];
    res.status(200).send(randomProduct)
});
