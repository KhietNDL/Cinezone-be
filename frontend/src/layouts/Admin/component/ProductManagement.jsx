import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getComboChildren,
  createComboProduct,
} from "../../../services/API";
import StatsCards from "../productComponent/StatsCards";
import SearchAndAdd from "../productComponent/SearchAndAdd";
import ProductTable from "../productComponent/ProductTable";
import ProductCards from "../productComponent/ProductCards";
import Pagination from "../movieComponent/Pagination";
import DeletePopup from "../productComponent/DeletePopup";
import ProductFormPopup from "../productComponent/ProductFormPopup";
import AddItemPopup from "../productComponent/AddItemPopup";
import ComboDetailPopup from "../productComponent/ComboDetailPopup";

const ProductManagement = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [comboIdForAddItem, setComboIdForAddItem] = useState("");
  const [addItemProductId, setAddItemProductId] = useState("");
  const [addItemQuantity, setAddItemQuantity] = useState(1);
  const [showComboDetail, setShowComboDetail] = useState(false);
  const [comboDetail, setComboDetail] = useState(null);
  const itemsPerPage = 5;

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await getAllProducts({ page, limit: itemsPerPage });
      setProducts(response.products);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalProducts(response.pagination.total);
      } else {
        const productsList = response.Products || response.data || [];
        setTotalProducts(productsList.length);
        setTotalPages(Math.ceil(productsList.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleViewComboDetail = async (productId) => {
    setLoading(true);
    try {
      const data = await getComboChildren(productId);
      setComboDetail(data);
      setShowComboDetail(true);
    } catch (error) {
      console.error("Error fetching combo details:", error);
      toast.error("Failed to fetch combo details");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetForm = () => {
    setProductId("");
    setProductName("");
    setDescription("");
    setUnit("");
    setPrice("");
    setQuantity("");
    setImage(null);
    setImagePreview(null);
    setOriginalImageUrl(null);
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ProductName", productName);
      formData.append("Description", description);
      formData.append("Unit", unit);
      formData.append("Price", price);
      formData.append("Quantity", quantity);
      if (image) {
        formData.append("image", image);
      } else if (isEdit && originalImageUrl) {
        formData.append("image", originalImageUrl);
      }

      if (isEdit) {
        if (!productId) {
          toast.error("Product ID is required for update.");
          setLoading(false);
          return;
        }
        await updateProduct(productId, formData);
        toast.success("Product updated successfully!");
      } else {
        const created = await createProduct(formData);
        toast.success("Product created successfully!");
        if (unit === "Combo" && created?.ProductId) {
          setComboIdForAddItem(created.ProductId);
          setShowAddItemPopup(true);
        }
      }
      resetForm();
      setShowFormPopup(false);
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setProductId(product.ProductId);
    setProductName(product.ProductName || "");
    setDescription(product.Description || "");
    setUnit(product.Unit || "");
    setPrice(product.Price || "");
    setQuantity(product.Quantity || "");
    setImage(null);
    setImagePreview(product.ImageUrl);
    setOriginalImageUrl(product.ImageUrl || null);
    setIsEdit(true);
    setShowFormPopup(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(selectedProduct.ProductId);
      toast.success("Product deleted successfully!");
      setShowDeletePopup(false);
      setSelectedProduct(null);
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + " VND";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(originalImageUrl);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return { status: "Out of Stock", class: "bg-red-100 text-red-700" };
    if (quantity < 10)
      return { status: "Low Stock", class: "bg-yellow-100 text-yellow-700" };
    return { status: "In Stock", class: "bg-green-100 text-green-700" };
  };

  const handleAddItemToCombo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createComboProduct({
        ComboId: comboIdForAddItem,
        ProductId: addItemProductId,
        Quantity: Number(addItemQuantity),
      });
      toast.success("Added item to combo successfully!");
      setShowAddItemPopup(false);
      setAddItemProductId("");
      setAddItemQuantity(1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to combo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          <StatsCards totalProducts={totalProducts} products={products} />
          <SearchAndAdd
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isEdit={isEdit}
            setShowFormPopup={setShowFormPopup}
            resetForm={resetForm}
          />
          <div className="bg-white rounded-md shadow-sm">
            <ProductTable
              products={products}
              handleEdit={handleEdit}
              setSelectedProduct={setSelectedProduct}
              setShowDeletePopup={setShowDeletePopup}
              setComboIdForAddItem={setComboIdForAddItem}
              setShowAddItemPopup={setShowAddItemPopup}
              handleViewComboDetail={handleViewComboDetail}
              getStockStatus={getStockStatus}
              formatPrice={formatPrice}
            />
            <ProductCards
              products={products}
              handleEdit={handleEdit}
              setSelectedProduct={setSelectedProduct}
              setShowDeletePopup={setShowDeletePopup}
              setComboIdForAddItem={setComboIdForAddItem}
              setShowAddItemPopup={setShowAddItemPopup}
              handleViewComboDetail={handleViewComboDetail}
              getStockStatus={getStockStatus}
              formatPrice={formatPrice}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
        <DeletePopup
          showDeletePopup={showDeletePopup}
          setShowDeletePopup={setShowDeletePopup}
          handleDelete={handleDelete}
          loading={loading}
        />
        <ProductFormPopup
          showFormPopup={showFormPopup}
          setShowFormPopup={setShowFormPopup}
          isEdit={isEdit}
          productName={productName}
          setProductName={setProductName}
          description={description}
          setDescription={setDescription}
          unit={unit}
          setUnit={setUnit}
          price={price}
          setPrice={setPrice}
          quantity={quantity}
          setQuantity={setQuantity}
          image={image}
          setImage={setImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          originalImageUrl={originalImageUrl}
          setOriginalImageUrl={setOriginalImageUrl}
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          resetForm={resetForm}
          loading={loading}
        />
        <AddItemPopup
          showAddItemPopup={showAddItemPopup}
          setShowAddItemPopup={setShowAddItemPopup}
          products={products}
          addItemProductId={addItemProductId}
          setAddItemProductId={setAddItemProductId}
          addItemQuantity={addItemQuantity}
          setAddItemQuantity={setAddItemQuantity}
          handleAddItemToCombo={handleAddItemToCombo}
          loading={loading}
        />
        <ComboDetailPopup
          showComboDetail={showComboDetail}
          setShowComboDetail={setShowComboDetail}
          comboDetail={comboDetail}
        />
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;
