import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { Question, CEFRLevel, QuizCategoryKey } from '../types';
import { QUIZ_CATEGORIES } from '../data/seed-data';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  CheckCircle2,
  BarChart3,
  HelpCircle,
  X,
  BookOpen,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, addToast } = useApp();
  const [questions, setQuestions] = useState<Question[]>(() => RusQuizStore.getQuestions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<QuizCategoryKey | 'all'>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CEFRLevel | 'all'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<QuizCategoryKey>('grammar');
  const [formLevel, setFormLevel] = useState<CEFRLevel>('A1');
  const [formQuestionRu, setFormQuestionRu] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanationUz, setFormExplanationUz] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [formIsPublished, setFormIsPublished] = useState(true);

  if (user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 text-center">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Ruxsat berilmagan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Ushbu bo‘lim faqat tizim ma’murlari (Admin) uchun ochiq.
        </p>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingQuestionId(null);
    setFormCategory('grammar');
    setFormLevel('A1');
    setFormQuestionRu('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanationUz('');
    setFormDifficulty('easy');
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestionId(q.id);
    setFormCategory(q.category);
    setFormLevel(q.level);
    setFormQuestionRu(q.question_ru);
    setFormOptions([...q.options]);
    setFormCorrectIndex(q.correct_index);
    setFormExplanationUz(q.explanation_uz);
    setFormDifficulty(q.difficulty);
    setFormIsPublished(q.is_published);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ushbu test savolini butunlay o‘chirib tashlamoqchimisiz?')) {
      RusQuizStore.deleteQuestion(id);
      setQuestions(RusQuizStore.getQuestions());
      addToast('Savol o‘chirildi', 'info');
    }
  };

  const handleTogglePublish = (q: Question) => {
    const updated = RusQuizStore.updateQuestion(q.id, { is_published: !q.is_published });
    if (updated) {
      setQuestions(RusQuizStore.getQuestions());
      addToast(
        updated.is_published ? 'Savol nashr qilindi' : 'Savol qoralamaga olindi',
        'info'
      );
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionRu.trim() || !formExplanationUz.trim()) {
      addToast('Iltimos, savol matni va izohni to‘ldiring', 'error');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      addToast('Barcha 4 ta javob variantini to‘ldiring', 'error');
      return;
    }

    if (editingQuestionId) {
      // Edit
      RusQuizStore.updateQuestion(editingQuestionId, {
        category: formCategory,
        level: formLevel,
        question_ru: formQuestionRu.trim(),
        options: formOptions.map((o) => o.trim()),
        correct_index: formCorrectIndex,
        explanation_uz: formExplanationUz.trim(),
        difficulty: formDifficulty,
        is_published: formIsPublished,
      });
      addToast('Savol muvaffaqiyatli tahrirlandi!', 'success');
    } else {
      // Add
      RusQuizStore.addQuestion({
        category: formCategory,
        level: formLevel,
        question_ru: formQuestionRu.trim(),
        options: formOptions.map((o) => o.trim()),
        correct_index: formCorrectIndex,
        explanation_uz: formExplanationUz.trim(),
        difficulty: formDifficulty,
        is_published: formIsPublished,
      });
      addToast('Yangi test savoli qo‘shildi!', 'success');
    }

    setQuestions(RusQuizStore.getQuestions());
    setIsModalOpen(false);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation_uz.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCatFilter !== 'all' && q.category !== selectedCatFilter) return false;
    if (selectedLevelFilter !== 'all' && q.level !== selectedLevelFilter) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-purple-200" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Admin Boshqaruv Markazi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">Savollar va Kontent boshqaruvi</h1>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 rounded-2xl bg-white text-purple-800 font-bold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi savol qo‘shish</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Jami savollar</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {questions.length} ta
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Nashr qilingan</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {questions.filter((q) => q.is_published).length} ta
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Kategoriyalar</div>
          <div className="text-2xl font-black text-[#4169E1] mt-1">6 ta yo‘nalish</div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Darajalar</div>
          <div className="text-2xl font-black text-purple-600 mt-1">A1 – C1</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Savol yoki tushuntirish bo‘yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value as QuizCategoryKey | 'all')}
            className="px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Barcha kategoriyalar</option>
            {QUIZ_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title_uz}
              </option>
            ))}
          </select>

          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value as CEFRLevel | 'all')}
            className="px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Barcha darajalar</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="px-5 py-3.5">Savol (Ruscha)</th>
                <th className="px-4 py-3.5">Kategoriya</th>
                <th className="px-3 py-3.5">Daraja</th>
                <th className="px-4 py-3.5">To‘g‘ri variant</th>
                <th className="px-3 py-3.5">Holat</th>
                <th className="px-5 py-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-4 max-w-xs truncate text-slate-900 dark:text-white font-bold">
                    {q.question_ru}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#4169E1] font-bold">
                      {q.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300 font-bold">
                    {q.level}
                  </td>
                  <td className="px-4 py-4 text-emerald-600 dark:text-emerald-400 font-semibold max-w-[150px] truncate">
                    {q.options[q.correct_index]}
                  </td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => handleTogglePublish(q)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.is_published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {q.is_published ? 'Nashr' : 'Qoralama'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
              {editingQuestionId ? 'Savolni tahrirlash' : 'Yangi test savoli qo‘shish'}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategoriya (Yo‘nalish)
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as QuizCategoryKey)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {QUIZ_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title_uz} ({c.title_ru})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CEFR Darajasi
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as CEFRLevel)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="A1">A1 — Boshlang‘ich</option>
                    <option value="A2">A2 — Elementar</option>
                    <option value="B1">B1 — O‘rta</option>
                    <option value="B2">B2 — Yuqori o‘rta</option>
                    <option value="C1">C1 — Mukammal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Savol matni (Rus tilida)
                </label>
                <textarea
                  rows={2}
                  placeholder="Masalan: Вставьте правильное окончание: «Мы живём в новом...»"
                  value={formQuestionRu}
                  onChange={(e) => setFormQuestionRu(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* 4 Options and correct answer selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  4 ta javob varianti (To‘g‘risini belgilang):
                </label>
                <div className="space-y-2">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 text-purple-600 cursor-pointer"
                        title="To‘g‘ri javob deb belgilash"
                      />
                      <span className="w-5 text-xs font-bold text-slate-500">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        placeholder={`Variant ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation in Uzbek */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  O‘zbekcha tushuntirish va grammatik qoida
                </label>
                <textarea
                  rows={3}
                  placeholder="Nega aynan shu javob to‘g‘ri ekanligini o‘zbek tilida tushuntiring..."
                  value={formExplanationUz}
                  onChange={(e) => setFormExplanationUz(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                  />
                  <span>Darhol nashr qilish (Foydalanuvchilarga ko‘rinsin)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
