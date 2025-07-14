import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  // searchProduct,
} from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineClose } from "react-icons/md";
import Pagination from "../movieComponent/Pagination";
import { createComboProduct } from "../../../services/API";

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
  const itemsPerPage = 5;
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [comboIdForAddItem, setComboIdForAddItem] = useState("");
  const [addItemProductId, setAddItemProductId] = useState("");
  const [addItemQuantity, setAddItemQuantity] = useState(1);
  // const searchTimeout = useRef();

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await getAllProducts({ page, limit: itemsPerPage });
      setProducts(response.products);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalProducts(response.pagination.total);
      } else {
        // If no pagination info, calculate from products array
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
  // useEffect(() => {
  //   if (!searchTerm) {
  //     fetchProducts(currentPage);
  //     return;
  //   }
  //   if (searchTimeout.current) clearTimeout(searchTimeout.current);
  //   searchTimeout.current = setTimeout(async () => {
  //     setLoading(true);
  //     try {
  //       const data = await searchProduct(searchTerm);
  //       setProducts(data.Products || data.products || []);
  //       setTotalPages(1);
  //       setTotalProducts(data?.Products?.length || data?.products?.length || 0);
  //       setCurrentPage(1);
  //     } catch (error) {
  //       console.error("Error searching products:", error);
  //       setProducts([]);
  //       setTotalPages(1);
  //       setTotalProducts(0);
  //       toast.error("Failed to search products.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 500);
  // }, [searchTerm, currentPage]);

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
        formData.append("image", image); // Gửi ảnh mới nếu có
      } else if (isEdit && originalImageUrl) {
        formData.append("image", originalImageUrl); // Gửi ImageUrl cũ nếu không chọn ảnh mới
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

  // Add Item to Combo handler
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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">
                  z`` Total Products
                </p>
                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {totalProducts}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">In Stock</p>
                <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {products.filter((p) => p.Quantity > 10).length}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">Low Stock</p>
                <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {
                  products.filter((p) => p.Quantity > 0 && p.Quantity <= 10)
                    .length
                }
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">
                  Out of Stock
                </p>
                <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {products.filter((p) => p.Quantity === 0).length}
              </p>
            </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-xl bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                placeholder="Search by product name"
              />
            </div>
            {!isEdit && (
              <button
                onClick={() => {
                  resetForm();
                  setShowFormPopup(true);
                }}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm w-full sm:w-auto text-sm sm:text-base"
              >
                <GoPlus size={18} className="mr-1 sm:mr-2" />
                Add Product
              </button>
            )}
          </div>

          {/* Table for Tablet and Desktop, Cards for Mobile */}
          <div className="bg-white p-2 sm:p-4 rounded-md shadow-sm">
            {/* Table Layout for sm and above */}
            <div className="hidden sm:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-2 text-center w-[150px] shrink-0">
                      Image
                    </th>
                    <th className="py-2 px-2 w-[200px] shrink-0">
                      Product Name
                    </th>
                    <th className="py-2 text-center w-[100px] shrink-0">
                      Unit
                    </th>
                    <th className="py-2 text-center w-[120px] shrink-0">
                      Price
                    </th>
                    <th className="py-2 text-center w-[100px] shrink-0">
                      Quantity
                    </th>
                    <th className="py-2 text-center w-[100px] shrink-0">
                      Status
                    </th>
                    <th className="py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.Quantity);

                    return (
                      <tr
                        key={product.ProductId}
                        className="border-b border-slate-200 hover:bg-slate-100 hover:rounded-lg cursor-pointer text-sm"
                      >
                        <td className="py-2 text-center w-[150px] shrink-0">
                          {product.ImageUrl ? (
                            <img
                              src={product.ImageUrl}
                              alt={product.ProductName}
                              className="w-20 h-20 object-cover rounded mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400 italic">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap w-[200px] shrink-0">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.ProductName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.Description}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-center w-[100px] shrink-0">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {product.Unit}
                          </span>
                        </td>
                        <td className="py-2 text-center w-[120px] shrink-0">
                          <span className="font-medium text-gray-900">
                            {formatPrice(product.Price)}
                          </span>
                        </td>
                        <td className="py-2 text-center w-[100px] shrink-0">
                          <span className="font-medium text-gray-900">
                            {product.Quantity}
                          </span>
                        </td>
                        <td className="py-2 text-center w-[100px] shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold text-xs ${stockStatus.class}`}
                          >
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-2 text-sm font-medium w-[100px] shrink-0">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                              title="Edit"
                              aria-label="Edit product"
                            >
                              <FaRegEdit size={20} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeletePopup(true);
                              }}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                              title="Delete"
                              aria-label="Delete product"
                            >
                              <RiDeleteBin5Line size={20} />
                            </button>
                            {product.Unit === "Combo" && (
                              <button
                                onClick={() => {
                                  setComboIdForAddItem(product.ProductId);
                                  setShowAddItemPopup(true);
                                }}
                                className="text-purple-500 hover:text-purple-700 cursor-pointer"
                                title="Add Item"
                                aria-label="Add item to combo"
                              >
                                Add Item
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.Quantity);

                return (
                  <article
                    key={product.ProductId}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      {product.ImageUrl ? (
                        <img
                          src={product.ImageUrl}
                          alt={product.ProductName}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                      <div className="flex-1 w-[200px]">
                        <h3 className="text-sm font-medium text-gray-900 break-words">
                          {product.ProductName}
                        </h3>
                        <p className="text-xs text-gray-500 break-words">
                          {product.Description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs grid grid-cols-2 gap-2 text-gray-700">
                      <p>
                        <strong>Unit:</strong> {product.Unit}
                      </p>
                      <p>
                        <strong>Price:</strong> {formatPrice(product.Price)}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {product.Quantity}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${stockStatus.class}`}
                        >
                          {stockStatus.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit product"
                      >
                        <FaRegEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeletePopup(true);
                        }}
                        className="text-red-400 hover:text-red-600"
                        aria-label="Delete product"
                      >
                        <RiDeleteBin5Line size={16} />
                      </button>
                      {product.Unit === "Combo" && (
                        <button
                          onClick={() => {
                            setComboIdForAddItem(product.ProductId);
                            setShowAddItemPopup(true);
                          }}
                          className="text-purple-500 hover:text-purple-700 cursor-pointer"
                          title="Add Item"
                          aria-label="Add item to combo"
                        >
                          Add Item
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
        {/* Delete Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-2">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl min-w-[280px] max-w-[90vw]">
              <RiDeleteBin5Line className="text-red-500" size={32} />
              <div className="font-semibold text-base sm:text-lg text-gray-700 my-2 text-center">
                Are you sure you want to delete this product?
              </div>
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Form Popup */}
        {showFormPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border border-gray-100 animate-slideUp">
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 py-5 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        {isEdit ? "Edit Product" : "Add New Product"}
                      </h2>
                      <p className="text-indigo-100 text-sm mt-1 font-medium">
                        {isEdit
                          ? "Update product information"
                          : "Create a new product entry"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormPopup(false);
                      resetForm();
                    }}
                    className="w-10 h-10 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-center group"
                    aria-label="Close"
                  >
                    <MdOutlineClose className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Product Info Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200/50 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Product Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div className="group">
                        <label
                          htmlFor="productName"
                          className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                        >
                          Product Name
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Enter product name"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Unit */}
                      <div className="group">
                        <label
                          htmlFor="unit"
                          className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                        >
                          Unit
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none"
                            required
                          >
                            <option value="">Select unit</option>
                            <option value="Box">📦 Box</option>
                            <option value="Cup">☕ Cup</option>
                            <option value="Combo">🎯 Combo</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="group">
                        <label
                          htmlFor="price"
                          className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                        >
                          Price (VND)
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="e.g. 50,000"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-400 text-sm font-medium">
                              ₫
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="group">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                        >
                          Quantity
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="e.g. 100"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="description"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                          placeholder="Enter product description..."
                          rows="4"
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="image"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Product Image
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer group">
                            <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-dashed border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 transition-all duration-200 flex items-center space-x-2">
                              <svg
                                className="w-5 h-5 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <span className="text-indigo-700 font-medium">
                                Choose Image
                              </span>
                            </div>
                            <input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <div className="relative group">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormPopup(false);
                        resetForm();
                      }}
                      className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all duration-200 font-medium shadow-sm"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{isEdit ? "Save Changes" : "Add Product"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <div className="font-semibold text-lg text-gray-800">
                      Processing...
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      Please wait a moment
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Item to Combo Popup */}
        {showAddItemPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden border border-gray-100 animate-slideUp">
              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-5 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">
                        Add to Combo
                      </h2>
                      <p className="text-emerald-100 text-sm mt-1">
                        Add item to existing combo
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddItemPopup(false)}
                    className="w-10 h-10 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-center group"
                    aria-label="Close"
                  >
                    <MdOutlineClose className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              </div>
              {/* Form Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
                <form className="space-y-6" onSubmit={handleAddItemToCombo}>
                  {/* Product Selection as Cards */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Select Product
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3 max-h-56 overflow-y-auto">
                      {products
                        .filter((p) => p.Unit !== "Combo")
                        .map((p) => (
                          <div
                            key={p.ProductId}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                              addItemProductId === p.ProductId
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200 bg-white hover:border-emerald-300"
                            }`}
                            onClick={() => setAddItemProductId(p.ProductId)}
                            tabIndex={0}
                            role="button"
                            aria-pressed={addItemProductId === p.ProductId}
                          >
                            <input
                              type="radio"
                              checked={addItemProductId === p.ProductId}
                              onChange={() => setAddItemProductId(p.ProductId)}
                              className="accent-emerald-500"
                            />
                            <img
                              src={
                                p.ImageUrl ||
                                "https://via.placeholder.com/40x40?text=No+Image"
                              }
                              alt={p.ProductName}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                            <span className="font-medium text-gray-800 text-base">
                              {p.ProductName}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* Quantity */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Quantity
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={addItemQuantity}
                        onChange={(e) => setAddItemQuantity(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        min={1}
                        placeholder="Enter quantity"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddItemPopup(false)}
                      className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all duration-200 font-medium shadow-sm"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      disabled={loading || !addItemProductId}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span>Add Item</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                    <div className="font-semibold text-lg text-gray-800">
                      Adding Item...
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      Please wait a moment
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add these CSS classes to your stylesheet or in a <style> tag */}
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
      </div>{" "}
    </div>
  );
};
export default ProductManagement;
