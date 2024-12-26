"use client"
import Image from "next/image";
import { Eye, RotateCw, Save } from "lucide-react";
import PersonalDetailForm from "./components/PersonalDetailForm";
import { useEffect, useRef, useState } from "react";
import { Education, emptyPersonalDetails, Experience, Hobby, Language, PersonalDetails, Skill } from "@/type";
import { educationsPreset, experiencesPreset, hobbiesPreset, languagesPreset, personalDetailsPreset, skillsPreset } from "@/presets";
import CvPreview from "./components/CvPreview";
import Allthemes from "./utils/Themes"
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import LanguagesForm from "./components/LanguagesForm";
import CompetencesFom from "./components/CompetencesFom";
import HobbieForm from "./components/HobbieForm";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import confetti from "canvas-confetti"

export default function Home() {
  const [competences, setCompetences] = useState<Skill[]>(skillsPreset);
  const [hobies, sethobies] = useState<Hobby[]>(hobbiesPreset);
  const [languages, setLanguages] = useState<Language[]>(languagesPreset)
  const [educations, setEducations] = useState<Education[]>(educationsPreset)
  const [experiences, setExperience] = useState<Experience[]>(experiencesPreset);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(personalDetailsPreset);
  const [file, setFile] = useState<File | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("cupcake");
  const [Zoom, setZoom] = useState<number>(163)

  const cvPreview = useRef(null);

  useEffect(() => {
    const defaulImageUrl = '/profil.jpg'
    fetch(defaulImageUrl)
      .then(response => response.blob())
      .then((blob) => {
        const defaultimage = new File([blob], "profil.jpg", { type: blob.type })
        setFile(defaultimage)
      })
  }, [])

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentTheme(event.target.value);
    // document.documentElement.setAttribute("data-theme", event.target.value);
  };

  const HandleResetPersonalDetails = () => {
    setPersonalDetails(emptyPersonalDetails);
    setFile(null);
  }
  const handleResetExperiences = () => setExperience([]);
  const handleResetEducation = () => setEducations([]);
  const handleResetLanguage = () => setLanguages([]);
  const handleResetCompetences = () => setCompetences([]);
  const handleResethobie = () => sethobies([]);

  
  const handledownloadPDF = async () => {
    const elment = cvPreview.current
    if (elment) {
      try {
        const canvas = await html2canvas(elment, {
          scale:3,
          useCORS:true,
        })
        const imgdata = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format:"A4",
        })

        const pdfwidth = pdf.internal.pageSize.getWidth();
        const pdfheight = (canvas.height * pdfwidth)/ canvas.width;

        // pdf.addImage(canvas.toDataURL("image/png"), "png", 0, 0, 211, 298);
        pdf.addImage(imgdata, "PNG", 0, 0, pdfwidth, pdfheight);

        pdf.save("cv.pdf");

        const modal = document.getElementById('my_modal_3') as HTMLDialogElement

        if (modal) {
          modal.close();
        }

        confetti({
          particleCount: 100,
          spread: 70 ,
          origin: {y:0.6},
          zIndex:9999
     })

        
      } catch (error) {
        console.error('erreur lors de la generation du PDF', error);
        alert('Erreur lors de la génération du PDF');
      }
    }

  }




  return (
    <div>
      <div className="hidden lg:block">
        <section className=" flex items-center h-screen">
          <div className="w-1/3 h-full p-10 bg-base-200 scrolable-container no-scrollbar">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold italic">
                CV
                <span className="text-primary">
                  Builder
                </span>
              </h1>

              <button
                onClick={() => (
                  document.getElementById('my_modal_3') as HTMLDialogElement
                ).showModal()}
                className=" btn btn-primary">
                Prévisualiser
                <Eye className="w-4" />
              </button>
            </div>


            <div className="flex flex-col gap-6 rounded-lg">
              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline"> Qui êtes vous?</h1>
                <button
                  onClick={HandleResetPersonalDetails}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>
              <PersonalDetailForm
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                setFile={setFile}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline"> Experience: </h1>
                <button
                  onClick={handleResetExperiences}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <ExperienceForm
                experience={experiences}
                setExperience={setExperience}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline"> Education: </h1>
                <button
                  onClick={handleResetEducation}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <EducationForm
                education={educations}
                setEducation={setEducations}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline"> Langue Parler: </h1>
                <button
                  onClick={handleResetLanguage}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>
              <LanguagesForm
                language={languages}
                setLanguage={setLanguages}
              />

              <div className="flex justify-between">
                <div className="w-1/2">
                  <div className="flex justify-between items-center">
                    <h1 className="badge badge-primary badge-outline"> Competences </h1>
                    <button
                      onClick={handleResetCompetences}
                      className="btn btn-primary btn-sm">
                      <RotateCw className="w-4" />
                    </button>
                  </div>
                  <CompetencesFom
                    competence={competences}
                    setCompetence={setCompetences}
                  />
                </div>
                <div className="w-1/2 ml-4">
                  <div className="flex justify-between items-center">
                    <h1 className="badge badge-primary badge-outline"> Loisirs </h1>
                    <button
                      onClick={handleResethobie}
                      className="btn btn-primary btn-sm">
                      <RotateCw className="w-4" />
                    </button>
                  </div>
                  <HobbieForm
                    hobie={hobies}
                    sethobie={sethobies}
                  />
                </div>
              </div>

            </div>


          </div>

          <div className="w-2/3 h-full p-10 bg-base-100  bg-[url('/file.svg')] bg-cover bg-center scrolable-View relative" >
            <div className="flex items-center justify-center fixed z-[9999] top-5 right-5 ">
              <input
                type="range"
                min={50}
                max={200}
                value={Zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="range range-xs range-primary" />
              <p className="ml-4 text-sm text-primary">{Zoom}% </p>
            </div>
            <select
              id="theme-selector"
              value={currentTheme}
              onChange={handleThemeChange}
              className="select select-bordered fixed z-[9999] select-sm top-12 right-5"
            >
              {Allthemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
            <div
              className=" flex justify-center items-center"
              style={{
                transform: `scale(${Zoom / 200})`,
                transition: "transform 0.3s ease-in-out"
              }}>
              <CvPreview
                personalDetails={personalDetails}
                file={file}
                theme={currentTheme}
                experiences={experiences}
                educations={educations}
                languages={languages}
                competences={competences}
                hobnies={hobies}
              />
            </div>
          </div>
        </section>


        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className="mt-5">
              <div className="flex justify-end mb-5">
                <button onClick={handledownloadPDF} className="btn btn-primary">
                  Télecharger
                  <Save className="w-4" />
                </button>
              </div>
              <div className="w-full max-w-full overflow-auto ">
              <div className="w-full max-w-full flex justify-center items-center">
                <CvPreview
                  personalDetails={personalDetails}
                  file={file}
                  theme={currentTheme}
                  experiences={experiences}
                  educations={educations}
                  languages={languages}
                  competences={competences}
                  hobnies={hobies}
                  download ={true}
                  ref={cvPreview}
                />
              </div>
              </div>

            </div>
          </div>
        </dialog>
      </div>

      <div className="lg:hidden">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold"> Désolé cher utilisateur cette application est accessible uniquement sur ordinateur</h1>
              <Image
                src="/sorrym.gif"
                alt="Picture of the author"
                width={500}
                height={500}
                className="mx-auto my-6"
              />
              <p className="py-6">
                Pour créer et personaliser votre CV, veuillez acceder a notre application via un ordinateur. Nous vous remercions  pour votre compréhension
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
