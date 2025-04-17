import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const equipmentOptions = [
  "Скутер SMART X",
  "Скутер VMC Cyclone",
  "VMC T16",
  "Питбайк VMC Raptor",
  "Питбайк VMC CRF125",
  "Питбайк VMC TTR125",
  "Питбайк VMC YCF125",
  "Питбайк VMC CRF190",
  "Питбайк VMC ZS190",
  "ПитБайк KXD PitBike 10/10"
];

export default function App() {
  const [form, setForm] = useState({
    contactPerson: "",
    company: "",
    vinCode: "",
    equipmentBrand: "",
    visualResult: "",
    files: []
  });

  useEffect(() => {
    // Инициализация Telegram Web App
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setForm((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("contactPerson", form.contactPerson);
    formData.append("company", form.company);
    formData.append("vinCode", form.vinCode);
    formData.append("equipmentBrand", form.equipmentBrand);
    formData.append("visualResult", form.visualResult);
    form.files.forEach((file, idx) => formData.append(`photo${idx + 1}`, file));

    try {
      const response = await fetch("/send-to-bitrix", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        alert("Рекламация отправлена успешно!");
        // Закрываем веб-приложение Telegram
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.close();
        }
        // Очищаем форму
        setForm({
          contactPerson: "",
          company: "",
          vinCode: "",
          equipmentBrand: "",
          visualResult: "",
          files: []
        });
      } else {
        throw new Error("Ошибка при отправке");
      }
    } catch (error) {
      alert("Ошибка при отправке. Попробуйте позже.");
      console.error("Error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f1f3f6] py-6 px-4 font-sans"
    >
      <div className="flex justify-center mb-4">
        <img
          src="https://static.tildacdn.com/tild3861-3564-4539-b862-666630643037/VMC_logo_rgb_Text_Al.svg"
          alt="VMC Logo"
          className="h-10 sm:h-14 opacity-80"
        />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-4 sm:p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl border border-[#dfe3e6] space-y-5"
      >
        <h1 className="text-center text-[20px] font-medium text-[#0d0d0d]">
          Форма рекламации для сервисного центра
        </h1>

        <div className="grid grid-cols-1 gap-3">
          <input
            name="contactPerson"
            type="text"
            placeholder="ФИО"
            required
            value={form.contactPerson}
            onChange={handleChange}
            className="px-3 py-2 border border-[#ced5dc] rounded-md w-full bg-[#f9f9fa] placeholder-[#999] text-sm focus:ring-2 focus:ring-[#2481cc] focus:outline-none"
          />

          <input
            name="company"
            type="text"
            placeholder="Компания"
            required
            value={form.company}
            onChange={handleChange}
            className="px-3 py-2 border border-[#ced5dc] rounded-md w-full bg-[#f9f9fa] placeholder-[#999] text-sm focus:ring-2 focus:ring-[#2481cc] focus:outline-none"
          />

          <input
            name="vinCode"
            type="text"
            placeholder="VIN-код"
            required
            value={form.vinCode}
            onChange={handleChange}
            className="px-3 py-2 border border-[#ced5dc] rounded-md w-full bg-[#f9f9fa] placeholder-[#999] text-sm focus:ring-2 focus:ring-[#2481cc] focus:outline-none"
          />

          <select
            name="equipmentBrand"
            value={form.equipmentBrand}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-[#ced5dc] rounded-md w-full bg-[#f9f9fa] text-sm text-[#333] focus:ring-2 focus:ring-[#2481cc] focus:outline-none"
          >
            <option value="">Выберите марку оборудования</option>
            {equipmentOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <textarea
          name="visualResult"
          placeholder="Описание проблемы"
          required
          value={form.visualResult}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-[#ced5dc] rounded-md bg-[#f9f9fa] text-sm placeholder-[#999] focus:ring-2 focus:ring-[#2481cc] focus:outline-none resize-none"
        />

        <div>
          <label className="text-sm font-medium text-[#444] text-center block mb-2">
            Загрузить фото (до 10 файлов)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-1.5 border border-[#ced5dc] rounded-md bg-white text-sm file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:bg-[#2481cc] file:text-white file:rounded"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#2481cc] text-white font-medium py-2.5 rounded-md text-sm tracking-wide hover:bg-[#1a6cab] transition"
        >
          Отправить рекламацию
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
