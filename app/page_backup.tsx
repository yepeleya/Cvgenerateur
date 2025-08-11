"use client"
import { Eye, RotateCw, Save, User as UserIcon, LogOut, FileText, LayoutDashboard, Globe } from "lucide-react";
import PersonalDetailForm from "./components/PersonalDetailForm";
import { useEffect, useRef, useState, Suspense } from "react";
import { Education, emptyPersonalDetails, Experience, Hobby, Language, PersonalDetails, Skill, User as UserType } from "@/type";
import { educationsPreset, experiencesPreset, hobbiesPreset, languagesPreset, personalDetailsPreset, skillsPreset } from "@/presets";
import CvPreview from "./components/CvPreview";
import Allthemes from "./utils/Themes"
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import LanguagesForm from "./components/LanguagesForm";
import CompetencesFom from "./components/CompetencesFom";
import HobbieForm from "./components/HobbieForm";
import CvManager from "./components/CvManager";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";
import CvStorageManager, { CvData } from "./utils/CvStorageManager";
import AuthManager from "./utils/AuthManager";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [competences, setCompetences] = useState<Skill[]>(skillsPreset);
  const [hobies, sethobies] = useState<Hobby[]>(hobbiesPreset);
  const [languages, setLanguages] = useState<Language[]>(languagesPreset)
  const [educations, setEducations] = useState<Education[]>(educationsPreset)
  const [experiences, setExperience] = useState<Experience[]>(experiencesPreset);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(personalDetailsPreset);
  const [file, setFile] = useState<File | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("cupcake");
  const [Zoom, setZoom] = useState<number>(163);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const cvPreview = useRef(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (!AuthManager.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const user = AuthManager.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [router]);

  // Charger un CV spécifique si demandé dans l'URL
  useEffect(() => {
    const loadCvId = searchParams.get('loadCv');
    if (loadCvId) {
      const savedCv = CvStorageManager.loadCv(loadCvId);
      if (savedCv) {
        handleLoadCv(savedCv.data);
      }
    }
  }, [searchParams]);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedData = CvStorageManager.loadCurrentCv();
    if (savedData) {
      setPersonalDetails(savedData.personalDetails);
      setExperience(savedData.experiences);
      setEducations(savedData.educations);
      setLanguages(savedData.languages);
      setCompetences(savedData.competences);
      sethobies(savedData.hobbies);
      setCurrentTheme(savedData.theme);
    }
  }, []);

  // Sauvegarde automatique quand les données changent
  useEffect(() => {
    const cvData: CvData = {
      personalDetails,
      experiences,
      educations,
      languages,
      competences,
      hobbies: hobies,
      theme: currentTheme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Éviter de sauvegarder les données initiales vides
    if (personalDetails.fullName || experiences.length > 0) {
      CvStorageManager.saveCurrentCv(cvData);
    }
  }, [personalDetails, experiences, educations, languages, competences, hobies, currentTheme]);

  useEffect(() => {
    const defaulImageUrl = '/profil.jpg'
    fetch(defaulImageUrl)
      .then(response => response.blob())
      .then((blob) => {
        const defaultimage = new File([blob], "profil.jpg", { type: blob.type })
        setFile(defaultimage)
      })
  }, [])

  // Fonction pour charger un CV depuis le gestionnaire
  const handleLoadCv = (cvData: CvData) => {
    setPersonalDetails(cvData.personalDetails);
    setExperience(cvData.experiences);
    setEducations(cvData.educations);
    setLanguages(cvData.languages);
    setCompetences(cvData.competences);
    sethobies(cvData.hobbies);
    setCurrentTheme(cvData.theme);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Version Desktop */}
      <div className="hidden lg:block">
        <section className="flex items-center min-h-screen">
          <div className="w-1/3 h-screen p-8 bg-base-200/80 backdrop-blur-sm scrolable-container no-scrollbar border-r border-base-300">
            {/* Header avec authentification */}
            <div className="mb-6 flex justify-between items-center animate-fade-in">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CV
                  <span className="text-accent font-extrabold">
                    Générateur
                  </span>
                </h1>
                <p className="text-sm text-base-content/60 mt-1">Créez votre CV professionnel</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/my-cvs')}
                  className="btn btn-secondary btn-sm hover:btn-secondary hover:scale-105 transition-all duration-300 shadow-lg">
                  <FileText className="w-4" />
                  Mes CV
                </button>
                
                <button
                  onClick={() => (
                    document.getElementById('my_modal_3') as HTMLDialogElement
                  ).showModal()}
                  className="btn btn-primary btn-sm hover:btn-primary hover:scale-105 transition-all duration-300 shadow-lg">
                  <Eye className="w-4" />
                  Prévisualiser
                </button>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm hover:scale-105 transition-all duration-300">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs">{currentUser?.fullName?.charAt(0) || 'U'}</span>
                      </div>
                    </div>
                    {currentUser?.fullName || 'Utilisateur'}
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300">
                    <li>
                      <a onClick={() => router.push('/dashboard')} className="hover:bg-primary/10">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a onClick={() => router.push('/my-cvs')} className="hover:bg-primary/10">
                        <FileText className="w-4 h-4" />
                        Mes CV
                      </a>
                    </li>
                    <li className="border-t border-base-300 mt-1 pt-1">
                      <a onClick={() => AuthManager.logout()} className="hover:bg-error/10 text-error">
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section d'aide et tips */}
            <div className="mb-6 p-4 bg-gradient-to-r from-info/10 to-success/10 rounded-lg border border-info/20 animate-fade-in-up">
              <h3 className="font-semibold text-info mb-2">💡 Conseils</h3>
              <p className="text-sm text-base-content/70">
                Remplissez les sections étape par étape. Votre CV se construit automatiquement !
              </p>
            </div>

            <div className="flex flex-col gap-6 rounded-lg animate-fade-in-up"
                 style={{ animationDelay: '0.2s' }}>
              {/* Gestionnaire de CV */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-300">
                <CvManager
                  currentCvData={{
                    personalDetails,
                    experiences,
                  educations,
                  languages,
                  competences,
                  hobbies: hobies,
                  theme: currentTheme,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                onLoadCv={handleLoadCv}
              />

              {/* Section Informations personnelles */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <UserIcon className="w-5 h-5" />
                    Qui êtes-vous ?
                  </h2>
                  <button
                    onClick={HandleResetPersonalDetails}
                    className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <PersonalDetailForm
                  personalDetails={personalDetails}
                  setPersonalDetails={setPersonalDetails}
                  setFile={setFile}
                />
              </div>

              {/* Section Expériences */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <FileText className="w-5 h-5" />
                    Expériences Professionnelles
                  </h2>
                  <button
                    onClick={handleResetExperiences}
                    className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <ExperienceForm
                  experience={experiences}
                  setExperience={setExperience}
                />
              </div>

              {/* Section Formation */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <UserIcon className="w-5 h-5" />
                    Formation
                  </h2>
                  <button
                    onClick={handleResetEducation}
                    className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <EducationForm
                  education={educations}
                  setEducation={setEducations}
                />
              </div>

              {/* Section Langues */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <Globe className="w-5 h-5" />
                    Langues Parlées
                  </h2>
                  <button
                    onClick={handleResetLanguage}
                    className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <LanguagesForm
                  language={languages}
                  setLanguage={setLanguages}
                />
              </div>

              {/* Section Compétences et Loisirs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                      <Eye className="w-5 h-5" />
                      Compétences
                    </h2>
                    <button
                      onClick={handleResetCompetences}
                      className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
                      <RotateCw className="w-4" />
                    </button>
                  </div>
                  <CompetencesFom
                    competence={competences}
                    setCompetence={setCompetences}
                  />
                </div>

                <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                      <User className="w-5 h-5" />
                      Loisirs
                    </h2>
                    <button
                      onClick={handleResethobie}
                      className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
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

          {/* Section de prévisualisation améliorée */}
          <div className="w-2/3 h-screen bg-[url('/file.svg')] bg-cover bg-center scrolable-View relative overflow-hidden">
            {/* Overlay décoratif */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
            
            {/* Contrôles en haut à droite */}
            <div className="absolute top-6 right-6 z-50 animate-fade-in">
              <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-base-content/80">Zoom:</span>
                  <input
                    type="range"
                    min={50}
                    max={200}
                    value={Zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="range range-xs range-primary" />
                  <span className="text-sm font-bold text-primary min-w-[45px]">{Zoom}%</span>
                </div>
                
                <select
                  id="theme-selector"
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="select select-bordered select-sm w-full"
                >
                  {Allthemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-full flex justify-center items-center p-8">
              <div
                className="transition-all duration-500 ease-out hover:shadow-2xl"
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

        {/* Modal de prévisualisation modernisée */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-100 to-base-200">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-error/20 hover:text-error transition-colors">✕</button>
            </form>
            <div className="mt-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Prévisualisation du CV
                </h3>
                <button 
                  onClick={handledownloadPDF} 
                  className="btn btn-primary hover:btn-primary hover:scale-105 transition-all duration-300 shadow-lg">
                  <Save className="w-4" />
                  Télécharger PDF
                </button>
              </div>
              <div className="w-full max-w-full overflow-auto border rounded-lg bg-white shadow-inner p-4">
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
                    download={true}
                    ref={cvPreview}
                  />
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>

      {/* Version Mobile/Tablette */}
      <div className="lg:hidden">
        <div className="min-h-screen bg-base-100">
          {/* Header Mobile */}
          <div className="navbar bg-base-200 shadow-lg">
            <div className="flex-1">
              <h1 className="text-xl font-bold">
                CV<span className="text-primary">Générateur</span>
              </h1>
            </div>
            <div className="flex-none">
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-ghost btn-sm">
                  <LayoutDashboard className="w-4" />
                </button>
                
                <button
                  onClick={() => router.push('/my-cvs')}
                  className="btn btn-secondary btn-sm">
                  <FileText className="w-4" />
                </button>
                
                <button
                  onClick={() => (
                    document.getElementById('mobile_modal') as HTMLDialogElement
                  ).showModal()}
                  className="btn btn-primary btn-sm">
                  <Eye className="w-4" />
                  Voir CV
                </button>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm">
                    <UserIcon className="w-4" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <a onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a onClick={() => router.push('/my-cvs')}>
                        <FileText className="w-4 h-4" />
                        Mes CV
                      </a>
                    </li>
                    <li>
                      <a onClick={() => AuthManager.logout()}>
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu Mobile */}
          <div className="p-4 space-y-6">
            {/* Gestionnaire de CV */}
            <CvManager
              currentCvData={{
                personalDetails,
                experiences,
                educations,
                languages,
                competences,
                hobbies: hobies,
                theme: currentTheme,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }}
              onLoadCv={handleLoadCv}
            />

            {/* Sélecteur de thème mobile */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <h3 className="font-semibold mb-2">Thème du CV</h3>
                <select
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="select select-bordered w-full"
                >
                  {Allthemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Informations personnelles</h3>
                  <button
                    onClick={HandleResetPersonalDetails}
                    className="btn btn-primary btn-xs">
                    <RotateCw className="w-3" />
                  </button>
                </div>
                <PersonalDetailForm
                  personalDetails={personalDetails}
                  setPersonalDetails={setPersonalDetails}
                  setFile={setFile}
                />
              </div>
            </div>

            {/* Expériences */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Expériences</h3>
                  <button
                    onClick={handleResetExperiences}
                    className="btn btn-primary btn-xs">
                    <RotateCw className="w-3" />
                  </button>
                </div>
                <ExperienceForm
                  experience={experiences}
                  setExperience={setExperience}
                />
              </div>
            </div>

            {/* Formation */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Formation</h3>
                  <button
                    onClick={handleResetEducation}
                    className="btn btn-primary btn-xs">
                    <RotateCw className="w-3" />
                  </button>
                </div>
                <EducationForm
                  education={educations}
                  setEducation={setEducations}
                />
              </div>
            </div>

            {/* Langues */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Langues</h3>
                  <button
                    onClick={handleResetLanguage}
                    className="btn btn-primary btn-xs">
                    <RotateCw className="w-3" />
                  </button>
                </div>
                <LanguagesForm
                  language={languages}
                  setLanguage={setLanguages}
                />
              </div>
            </div>

            {/* Compétences et Loisirs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Compétences</h3>
                    <button
                      onClick={handleResetCompetences}
                      className="btn btn-primary btn-xs">
                      <RotateCw className="w-3" />
                    </button>
                  </div>
                  <CompetencesFom
                    competence={competences}
                    setCompetence={setCompetences}
                  />
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Loisirs</h3>
                    <button
                      onClick={handleResethobie}
                      className="btn btn-primary btn-xs">
                      <RotateCw className="w-3" />
                    </button>
                  </div>
                  <HobbieForm
                    hobie={hobies}
                    sethobie={sethobies}
                  />
                </div>
              </div>
            </div>

            {/* Bouton de téléchargement fixe en bas */}
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={handledownloadPDF}
                className="btn btn-primary btn-lg shadow-lg">
                <Save className="w-5" />
                PDF
              </button>
            </div>
          </div>

          {/* Modal de prévisualisation mobile */}
          <dialog id="mobile_modal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className="mt-5">
                <div className="flex justify-between mb-5">
                  <h3 className="font-bold text-lg">Aperçu de votre CV</h3>
                  <button onClick={handledownloadPDF} className="btn btn-primary">
                    <Save className="w-4" />
                    Télécharger
                  </button>
                </div>
                <div className="w-full overflow-auto">
                  <div className="flex justify-center items-center">
                    <CvPreview
                      personalDetails={personalDetails}
                      file={file}
                      theme={currentTheme}
                      experiences={experiences}
                      educations={educations}
                      languages={languages}
                      competences={competences}
                      hobnies={hobies}
                      download={true}
                      ref={cvPreview}
                    />
                  </div>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
      <HomeContent />
    </Suspense>
  );
}
