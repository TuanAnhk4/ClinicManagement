'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  FileSpreadsheet, 
  File as FileIcon 
} from 'lucide-react';

// Components
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

// --- 1. ĐỊNH NGHĨA TYPE & MOCK DATA ---

type DocType = 'PDF' | 'DOCX' | 'XLSX';
type DocCategory = 'GUIDELINE' | 'PROTOCOL' | 'FORM' | 'RESEARCH';

interface DocumentItem {
  id: number;
  title: string;
  category: DocCategory;
  type: DocType;
  size: string;
  updatedAt: string;
  description: string;
}

// Danh mục hiển thị
const CATEGORIES: { value: DocCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PROTOCOL', label: 'Phác đồ điều trị' },
  { value: 'GUIDELINE', label: 'Hướng dẫn quy trình' },
  { value: 'FORM', label: 'Biểu mẫu hành chính' },
  { value: 'RESEARCH', label: 'Nghiên cứu khoa học' },
];

// Dữ liệu giả lập (Thực tế sẽ gọi API)
const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 1,
    title: 'Phác đồ điều trị Tăng huyết áp 2024',
    category: 'PROTOCOL',
    type: 'PDF',
    size: '2.4 MB',
    updatedAt: '20/10/2024',
    description: 'Cập nhật mới nhất theo khuyến cáo của Hội Tim mạch học Việt Nam.',
  },
  {
    id: 2,
    title: 'Quy trình kiểm soát nhiễm khuẩn bệnh viện',
    category: 'GUIDELINE',
    type: 'PDF',
    size: '1.1 MB',
    updatedAt: '15/09/2024',
    description: 'Quy định bắt buộc đối với nhân viên y tế tại khu vực phòng khám.',
  },
  {
    id: 3,
    title: 'Mẫu bệnh án ngoại trú (Mẫu A2)',
    category: 'FORM',
    type: 'DOCX',
    size: '500 KB',
    updatedAt: '01/06/2024',
    description: 'Mẫu chuẩn dùng cho bệnh nhân khám bảo hiểm y tế.',
  },
  {
    id: 4,
    title: 'Danh mục thuốc thiết yếu Bộ Y Tế',
    category: 'GUIDELINE',
    type: 'XLSX',
    size: '4.5 MB',
    updatedAt: '10/11/2024',
    description: 'Bảng tính danh mục thuốc được cấp phát và giá trần.',
  },
  {
    id: 5,
    title: 'Nghiên cứu ứng dụng AI trong chẩn đoán hình ảnh',
    category: 'RESEARCH',
    type: 'PDF',
    size: '8.2 MB',
    updatedAt: '05/11/2024',
    description: 'Tài liệu tham khảo nội bộ dành cho khoa Chẩn đoán hình ảnh.',
  },
];

// --- 2. COMPONENT CHÍNH ---

export default function DoctorDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory | 'ALL'>('ALL');

  // Logic lọc tài liệu (Filter)
  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Helper chọn icon theo loại file
  const getFileIcon = (type: DocType) => {
    switch (type) {
      case 'PDF': return <FileText className="text-red-500" size={32} />;
      case 'DOCX': return <FileIcon className="text-blue-500" size={32} />;
      case 'XLSX': return <FileSpreadsheet className="text-green-500" size={32} />;
      default: return <FileText className="text-gray-500" size={32} />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kho Tài Liệu Y Khoa</h1>
          <p className="text-sm text-gray-500">Tra cứu phác đồ, hướng dẫn và biểu mẫu chuyên ngành.</p>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm kiếm tài liệu..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 group">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                  {/* Icon File */}
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {getFileIcon(doc.type)}
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    {doc.type}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {doc.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                  <span>Cập nhật: {doc.updatedAt}</span>
                  <span>Size: {doc.size}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-100 p-3 flex gap-2 bg-gray-50/50 rounded-b-xl">
                <Button variant="outline" size="small" className="flex-1 bg-white gap-2">
                  <Eye size={14} /> Xem
                </Button>
                <Button size="small" className="flex-1 gap-2">
                  <Download size={14} /> Tải về
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-3">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium">Không tìm thấy tài liệu nào.</p>
          <Button 
            variant="ghost" 
            size="small" 
            className="mt-2" 
            onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

    </div>
  );
}