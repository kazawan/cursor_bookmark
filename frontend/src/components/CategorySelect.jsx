import { useState } from 'react';

export default function CategorySelect({ existingCategories, selectedCategories, onChange }) {
  const [newCategory, setNewCategory] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      const category = newCategory.trim();
      if (!existingCategories.includes(category)) {
        onChange([...selectedCategories, category]);
      }
      setNewCategory('');
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const removeCategory = (category) => {
    onChange(selectedCategories.filter(c => c !== category));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {existingCategories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategories.includes(category)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加新分类（回车确认）"
          className="flex-1 p-2 border rounded text-black"
        />
      </div>
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(category => (
            <span
              key={category}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {category}
              <button
                onClick={() => removeCategory(category)}
                className="hover:text-red-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 