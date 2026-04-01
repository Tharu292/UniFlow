import { useState } from 'react';
import { Plus, Search, BookOpen, Download, Eye } from 'lucide-react';
import type { Resource } from '../types';
import AddResourceModal from '../components/AddResourceModal';
import MyResources from '../components/MyResourceModal'; // fixed component name
import toast from 'react-hot-toast';

const CURRENT_USER = "user123";

export default function Resources() {
  const [view, setView] = useState<'library' | 'my'>('library');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Data Structures Notes',
      fileName: 'ds-notes.pdf',
      module: 'IT2040',
      semester: 'Semester 2',
      year: 'Year 3',
      tags: ['pdf', 'notes', 'data structures'],
      description: 'Complete notes for linked lists, stacks, and queues.',
      createdBy: 'user123'
    },
    {
      id: '2',
      title: 'Database Past Papers',
      fileName: 'db-papers.zip',
      module: 'IT2030',
      semester: 'Semester 2',
      year: 'Year 2',
      tags: ['past papers', 'exam'],
      description: 'Collection of past exam papers with answers.',
      createdBy: 'user123'
    },
    {
      id: '3',
      title: 'UI/UX Design Guide',
      fileName: 'uiux.pdf',
      module: 'IT3050',
      semester: 'Semester 3',
      year: 'Year 1',
      tags: ['design', 'guide'],
      description: 'Modern UI/UX principles and examples.',
      createdBy: 'user123'
    },
    {
      id: '4',
      title: 'Oracle setup',
      fileName: 'oracle-setup.pdf',
      module: 'IT2030',
      semester: 'Semester 2',
      year: 'Year 3',
      tags: ['download', 'software', 'guide'],
      description: 'A guide to setup oracle database software.',
      createdBy: 'user123'
    },
    {
      id: '5',
      title: 'NDM SNMP',
      fileName: 'db-papers.zip',
      module: 'IT2030',
      semester: 'Semester 2',
      year: 'Year 2',
      tags: ['notes', 'mid exam'],
      description: 'A short note covering SNMP lecture.',
      createdBy: 'user123'
    },
    {
      id: '6',
      title: 'PAF Past Papers',
      fileName: 'paf-papers.zip',
      module: 'IT3030',
      semester: 'Semester 2',
      year: 'Year 2',
      tags: ['past papers', 'exam'],
      description: 'Collection of past exam papers with answers.',
      createdBy: 'user123'
    },
  ]);

  const addResource = (newResource: Omit<Resource, 'id'>, file?: File) => {
    if (editingResource) {
      setResources(resources.map(r =>
        r.id === editingResource.id ? { ...r, ...newResource } : r
      ));
      toast.success('Resource updated');
      setEditingResource(null);
      return;
    }

    if (!file) return;

    setResources([
      ...resources,
      {
        ...newResource,
        id: Date.now().toString(),
        fileName: file.name,
        createdBy: CURRENT_USER
      }
    ]);

    toast.success('Resource uploaded');
  };

  const deleteResource = (id: string) => {
    if (confirm('Delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      toast.success('Deleted successfully');
    }
  };

  const myResources = resources.filter(r => r.createdBy === CURRENT_USER);

  const filteredResources = resources.filter(r => {
    return (
      r.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? r.tags.includes(typeFilter) : true) &&
      (moduleFilter ? r.module === moduleFilter : true) &&
      (semesterFilter ? r.semester === semesterFilter : true) &&
      (yearFilter ? r.year === yearFilter : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
<div
  className="text-white py-5"
  style={{
    background: 'linear-gradient(90deg, #006591 0%, #cc5500 100%)'
  }}
>
  <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

    <h1 className="text-2xl font-semibold">Resources</h1>

    <div className="flex gap-2">
      <button
        onClick={() => setView('library')}
        className={`px-4 py-2 rounded-lg ${
          view === 'library' ? 'bg-white text-[#006591]' : 'bg-[#00557a]'
        }`}
      >
        Library
      </button>
      <button
        onClick={() => setView('my')}
        className={`px-4 py-2 rounded-lg ${
          view === 'my' ? 'bg-white text-[#006591]' : 'bg-[#00557a]'
        }`}
      >
        My Resources
      </button>
      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-[#006591] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md hover:bg-gray-100 transition"
      >
        <Plus size={16} /> Upload
      </button>
    </div>

  </div>
</div>

      {/* SWITCH VIEW */}
      {view === 'my' ? (
        <MyResources
          resources={myResources}
          onDelete={deleteResource}
          onEdit={(r) => {
            setEditingResource(r);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* FILTER BAR */}
          <div className="bg-gray-300 p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-3 items-center">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg flex-1 min-w-[200px] shadow-sm">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-transparent outline-none ml-2 text-sm w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select className="px-3 py-2 rounded-lg text-sm bg-white shadow-sm" onChange={e => setTypeFilter(e.target.value)}>
              <option value="">Type</option>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="past papers">Past Papers</option>
            </select>

            <select className="px-3 py-2 rounded-lg text-sm bg-white shadow-sm" onChange={e => setModuleFilter(e.target.value)}>
              <option value="">Module</option>
              <option value="IT2040">IT2040</option>
              <option value="IT2030">IT2030</option>
              <option value="IT3050">IT3050</option>
            </select>

            <select className="px-3 py-2 rounded-lg text-sm bg-white shadow-sm" onChange={e => setSemesterFilter(e.target.value)}>
              <option value="">Semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
            </select>

            <select className="px-3 py-2 rounded-lg text-sm bg-white shadow-sm" onChange={e => setYearFilter(e.target.value)}>
              <option value="">Year</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>
          </div>

          {/* RESOURCE CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-gray-100 rounded-xl p-5 shadow-md hover:shadow-lg transition">

                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={18} className="text-[#006591]" />
                  <h2 className="font-semibold text-base text-black">{resource.title}</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <p className="text-xs text-gray-400 mb-3">{resource.fileName}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, i) => (
                    <span key={i} className="bg-white px-2 py-1 text-xs rounded shadow-sm">{tag}</span>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.module}</span>
                  <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.semester}</span>
                  <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.year}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-white py-2 rounded-lg text-sm shadow-sm hover:bg-gray-200 transition">
                    <Eye size={14} /> Preview
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#cc5500] text-white py-2 rounded-lg text-sm shadow-md hover:bg-[#00557a] transition">
                    <Download size={14} /> Download
                  </button>
                </div>

              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-10 text-gray-400">No resources found</div>
          )}

        </div>
      )}

      <AddResourceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingResource(null);
        }}
        onAdd={addResource}
        editingResource={editingResource}
      />
    </div>
  );
}