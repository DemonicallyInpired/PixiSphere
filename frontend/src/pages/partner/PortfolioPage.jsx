import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnerApi, uploadApi } from '../../services/api'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  X, 
  Save, 
  Eye,
  GripVertical
} from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PortfolioPage = () => {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  
  const { data: portfolio, isLoading, isError } = useQuery({
    queryKey: ['partner-portfolio'],
    queryFn: partnerApi.getPortfolio
  })
  
  const { mutate: addPortfolioItem, isPending: isAddingItem } = useMutation({
    mutationFn: partnerApi.addPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-portfolio'])
      toast.success('Portfolio item added successfully!')
      setIsAdding(false)
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add portfolio item')
    }
  })
  
  const { mutate: updatePortfolioItem, isPending: isUpdatingItem } = useMutation({
    mutationFn: ({ itemId, itemData }) => partnerApi.updatePortfolioItem(itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-portfolio'])
      toast.success('Portfolio item updated successfully!')
      setEditingId(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update portfolio item')
    }
  })
  
  const { mutate: deletePortfolioItem } = useMutation({
    mutationFn: partnerApi.deletePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-portfolio'])
      toast.success('Portfolio item deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete portfolio item')
    }
  })
  
  const { mutate: reorderPortfolio } = useMutation({
    mutationFn: (items) => {
      // This would be a bulk update API call in a real implementation
      // For now, we'll just invalidate the query
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-portfolio'])
      toast.success('Portfolio reordered successfully!')
    },
    onError: (error) => {
      toast.error('Failed to reorder portfolio')
    }
  })
  
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()
  
  const onSubmit = (data) => {
    // Mock image upload for now
    const mockImageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`
    
    const portfolioData = {
      ...data,
      imageUrl: mockImageUrl,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    }
    
    if (editingId) {
      updatePortfolioItem({ itemId: editingId, itemData: portfolioData })
    } else {
      addPortfolioItem(portfolioData)
    }
  }
  
  const handleEdit = (item) => {
    setEditingId(item.id)
    reset({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags?.join(', ') || ''
    })
  }
  
  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      deletePortfolioItem(itemId)
    }
  }
  
  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    reset()
  }
  
  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e, targetItem) => {
    e.preventDefault()
    if (draggedItem && draggedItem.id !== targetItem.id) {
      // Simple reorder implementation
      const newOrder = [...portfolio]
      const draggedIndex = newOrder.findIndex(item => item.id === draggedItem.id)
      const targetIndex = newOrder.findIndex(item => item.id === targetItem.id)
      
      // Remove dragged item
      const [removed] = newOrder.splice(draggedIndex, 1)
      // Insert at new position
      newOrder.splice(targetIndex, 0, removed)
      
      // Update order (in a real app, you'd send this to the backend)
      reorderPortfolio(newOrder)
    }
    setDraggedItem(null)
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Failed to load portfolio. Please try again later.</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-600 mt-2">Showcase your best work to attract clients</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              reset()
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
      
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="form-input"
                    placeholder="Project title"
                  />
                  {errors.title && (
                    <p className="form-error">{errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Category</label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="form-select"
                  >
                    <option value="">Select a category</option>
                    <option value="wedding">Wedding</option>
                    <option value="portrait">Portrait</option>
                    <option value="event">Event</option>
                    <option value="commercial">Commercial</option>
                    <option value="fashion">Fashion</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="form-error">{errors.category.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe this project..."
                  />
                  {errors.description && (
                    <p className="form-error">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Tags</label>
                  <input
                    {...register('tags')}
                    className="form-input"
                    placeholder="outdoor, natural light, couple (comma separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter tags separated by commas</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Image</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isAddingItem || isUpdatingItem}
                  className="btn-primary flex items-center"
                >
                  {(isAddingItem || isUpdatingItem) ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {(isAddingItem || isUpdatingItem) ? 'Saving...' : 'Save Item'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {portfolio && portfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className="relative">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 cursor-move">
                  <GripVertical className="h-5 w-5 text-white bg-black bg-opacity-50 rounded p-1" />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags && item.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-12 text-center">
          <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
          <p className="text-gray-600 mb-6">Add your first portfolio item to showcase your work</p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </button>
        </div>
      )}
    </div>
  )
}

export default PortfolioPage
