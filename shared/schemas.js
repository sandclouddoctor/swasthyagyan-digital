/* Auto-generated shared schema module — used by both client (form engine) and server (CSV export headers). Edit this single file; both sides import it. */

const T = (id, label, req) => ({ id, label, type: "text", required: !!req });
const N = (id, label, req) => ({ id, label, type: "number", required: !!req });
const D = (id, label, req) => ({ id, label, type: "decimal", required: !!req });
const DT = (id, label, req) => ({ id, label, type: "date", required: !!req });
const PH = (id, label, req) => ({ id, label, type: "phone", required: !!req });
const TA = (id, label, req) => ({ id, label, type: "textarea", required: !!req });
const S = (id, label, options, req) => ({ id, label, type: "select", options, required: !!req });
const M = (id, label, options, req) => ({ id, label, type: "multiselect", options, required: !!req });
const Y = (id, label, req) => ({ id, label, type: "yesno", required: !!req });
const NOTE = (id, label) => ({ id, label, type: "photo", required: false });
const SEC = (label) => ({ type: "section", label });
const MULTI = (id, label, fields) => ({ type: "multi", id, label, fields });
const REPEAT = (id, label, itemLabel, fields) => ({ type: "repeat", id, label, itemLabel, fields });
const IF = (item, id, equals) => ({ ...item, showIf: { id, equals } });

/* ============================================================
   SCHEMAS  — adapted in full from the AIIMS BBSR FHAS forms,
   plus two new modules (Geriatric, Adolescent)
============================================================ */

const FAMILY_SCHEMA = [
  SEC("Student & visit details"),
  T("studentName", "Name of the student", 1),
  N("rollNo", "Roll number", 1),
  N("batchYear", "MBBS batch year", 1),

  SEC("General data of the family"),
  T("village", "Village / ward name", 1),
  N("gully", "Gully / street number", 1),
  T("policeStation", "Police station", 1),
  T("postOffice", "Post office", 1),
  T("houseNo", "House number"),
  T("landmark", "Landmark"),
  T("hohName", "Name of head of household", 1),
  PH("hohPhone", "Phone number", 1),
  N("monthsInArea", "Living in the area for (months)", 1),
  S("religion", "Religion", ["Hindu", "Muslim", "Christian", "Other"], 1),
  N("numPregnant", "Number of pregnant women in the family", 1),
  N("numUnder5", "Number of under-five children in the family", 1),
  S("birthsLastYr", "Births in the family last year", ["Zero", "One", "Two", "Three", "More than three"], 1),
  S("deathsLastYr", "Deaths in the family last year", ["Zero", "One", "Two", "Three", "More than three"], 1),
  Y("hospitalised", "Any hospitalisation in the last year", 1),
  IF(TA("hospitalisedDetails", "Who, and for how long?"), "hospitalised", "Yes"),
  Y("marriageLastYr", "Any marriage in the family in last year", 1),
  Y("divorceLastYr", "Any divorce in the family in last year", 1),
  MULTI("nearestFacilities", "Nearest facilities & distance (km)", [
    T("nearestSchool", "School", 1),
    T("nearestMarket", "Market", 1),
    T("nearestBank", "Bank", 1),
    T("nearestHospital", "Hospital", 1),
    T("nearestSubcentre", "Sub-centre (AAM)", 1),
  ]),
  MULTI("facilityNetwork", "Health facility network", [
    T("phcName", "Village comes under which PHC?", 1),
    T("chcName", "Village comes under which CHC?", 1),
  ]),

  SEC("Family members — demographic details (one by one)"),
  REPEAT("members", "Family members", "family member", [
    MULTI("m_identity", "Identity", [N("m_sl", "Sl. No.", 1), T("m_name", "Name", 1), T("m_relation", "Relationship with head of household", 1)]),
    MULTI("m_details", "Details", [
      N("m_age", "Age", 1),
      DT("m_dob", "Date of birth"),
      S("m_sex", "Sex", ["Male", "Female", "Other"], 1),
      T("m_education", "Highest education", 1),
      T("m_occupation", "Occupation", 1),
      S("m_workClass", "Classification of work", ["Sedentary work", "Moderate work", "Heavy work", "Invalid (Child/Adolescent)"], 1),
    ]),
    TA("m_healthProblem", "Any health problem", 1),
  ]),

  SEC("Family diagrams (paper-based)"),
  NOTE("pedigreeNote", "Pedigree chart — draw on paper with serial numbers matching members above, photograph and attach to this record"),
  NOTE("mapNote", "Village map with index house and landmarks — photograph and attach"),
  NOTE("transectNote", "Transect walk diagram — photograph and attach"),

  SEC("Dietary assessment (3 days, excluding fasting/feast days)"),
  REPEAT("diet", "Dietary recall", "day", [
    S("d_day", "Day", ["Day 1", "Day 2", "Day 3"], 1),
    MULTI("d_staples", "Staples", [
      N("d_rice", "Rice (g)", 1),
      N("d_wheat", "Wheat (g)", 1),
      T("d_millet", 'Millet used & amount (g). Write "None, 0" if not used', 1),
      T("d_dal", "Dal/pulses type & amount (g)", 1),
    ]),
    MULTI("d_veg", "Vegetables", [
      N("d_glv", "Green leafy vegetables (g)", 1),
      N("d_roots", "Roots & tubers (g)", 1),
      N("d_otherveg", "Other vegetables (g)", 1),
    ]),
    MULTI("d_nonveg", "Non-veg, dairy, fruit & fats", [
      T("d_meat", 'Meat type & amount (g). Write "None, 0" if not used', 1),
      T("d_egg", 'Egg type & amount (numbers). Write "None, 0" if not used', 1),
      T("d_milk", "Milk & milk products, amount", 1),
      T("d_fruit", "Fruit type & amount (g)", 1),
      N("d_oil", "Oil / ghee (g)", 1),
      N("d_sugar", "Sugar / jaggery (g)", 1),
    ]),
  ]),
  NOTE("foodPyramidNote", "Food pyramid of the family — photograph and attach"),
  TA("dietComment", "Comment on dietary intake & recommendations (~200 words)", 1),

  SEC("Physical environment — house"),
  MULTI("houseBasic", "House basics", [
    S("houseOwnership", "Ownership of the house", ["Own", "Rented", "Others"], 1),
    S("houseType", "Type of house", ["Kutcha", "Pucca", "Mixed"], 1),
    T("roofMaterial", "Roofing material", 1),
    T("wallMaterial", "Wall structure material", 1),
    T("floorType", "Floor type", 1),
    N("numRooms", "Number of rooms", 1),
  ]),
  NOTE("houseMapNote", "House map — kitchen, bathroom, doors/windows, sheds — photograph and attach"),
  NOTE("houseOutsideNote", "Photo of house from outside — attach"),
  Y("overcrowding", "Overcrowding present"),
  T("overcrowdingCriterion", 'Criterion for overcrowding (write "None" if absent)', 1),
  S("kitchenLocation", "Location of kitchen", ["Separate from house", "Attached to the house", "Inside the living room/s"], 1),
  M("cookingFuel", "Cooking fuel used", ["LPG", "Electric", "Kerosene stove", "Firewood/dung"], 1),
  Y("smokeOutlet", "Smoke outlet present", 1),
  MULTI("foodStorage", "Food storage & handling", [
    T("rawFoodStorage", "Where raw foods are stored", 1),
    T("cookedFoodStorage", "Where cooked foods are stored", 1),
    S("foodUncovered", "Any food item lying uncovered?", ["Yes", "No"], 1),
    S("foodOnFloor", "Any food item thrown on the floor?", ["Yes", "No"], 1),
  ]),
  NOTE("kitchenPhotoNote", "Photo of kitchen, if allowed"),
  MULTI("waterSupply", "Water supply", [
    S("waterType", "Type of water supply", ["Piped water supply", "Pump-well", "Open well", "Lake/pond"], 1),
    S("waterTreatment", "Treatment of water before use", ["None", "Boiling (Heat method)", "Chemical treatment", "Filtration (RO/UV, candle filter etc.)"], 1),
    T("waterStorageLocation", "Where water is stored", 1),
    T("waterDrawMethod", "How water is drawn from storage", 1),
    S("chlorineKnowledge", "Know where chlorine tablets are available?", ["Yes", "No"], 1),
  ]),
  MULTI("wasteDisposal", "Waste disposal", [
    S("wasteWaterDest", "Where does waste water go?", ["Drainage system", "Soakage pit", "Kitchen garden", "Accumulates in an open ditch/ditches"], 1),
    S("solidWasteMethod", "Nature of solid waste disposal", ["Bury", "Burn", "Public bin", "Thrown indiscriminately"], 1),
    T("disposalSite", "Site of disposal", 1),
    N("disposalDistance", "Distance of disposal site from home (km)", 1),
    N("disposalFrequency", "Frequency of disposal (per day)", 1),
  ]),
  NOTE("wasteWaterPhotoNote", "Photo of waste water disposal site"),
  MULTI("toiletInfo", "Sanitation", [
    S("toiletType", "Toilet type", ["Flush", "Bore/dug hole", "Open air"], 1),
    S("toiletRunningWater", "Running water inside toilet?", ["Yes", "No"], 1),
    S("childOpenDefecation", "Are children made to defecate around the house/streets?", ["Yes", "No"], 1),
  ]),
  MULTI("ventLighting1", "Ventilation", [
    T("kitchenVent", "Type of ventilation in kitchen", 1),
    T("livingVent", "Type of ventilation in living rooms", 1),
    S("kitchenVentAdequacy", "Adequacy of ventilation in kitchen", ["Adequate", "Inadequate"], 1),
    S("livingVentAdequacy", "Adequacy of ventilation in living rooms", ["Adequate", "Inadequate"], 1),
  ]),
  MULTI("ventLighting2", "Lighting", [
    S("kitchenLightAdequacy", "Adequacy of lighting in kitchen", ["Adequate", "Inadequate"], 1),
    S("studyLightAdequacy", "Adequacy of lighting in study area", ["Adequate", "Inadequate"], 1),
    S("livingLightAdequacy", "Adequacy of lighting in living rooms", ["Adequate", "Inadequate"], 1),
  ]),
  M("physicalHazards", "Physical hazards present", ["Steep steps", "Slippery floors", "Pointed edges of furniture and construction", "Drowning possibility", "Fire hazard", "Electrical hazard"], 1),
  MULTI("coolerInfo", "Cooler", [
    S("coolerPresent", "Cooler available in house?", ["Yes", "No"], 1),
    S("coolerCleaned", "Is the cooler cleaned?", ["Yes", "No"]),
    T("coolerCleanInterval", "If cleaned, at what interval?"),
  ]),
  M("waterAccumSites", "Sites of water accumulation", ["Flower pots", "Broken clay pots", "Plastic cups/buckets", "Tyres", "Ditches"], 1),
  MULTI("houseSafety", "Safety features", [
    S("solarHeater", "Solar water heater", ["Present", "Absent"], 1),
    S("rainHarvest", "Rain water harvesting", ["Present", "Absent"], 1),
    S("fencing", "Fencing around house", ["Present", "Absent"], 1),
    S("wellCover", "Parapet and cover over well", ["Present", "Absent"], 1),
    S("doorNets", "Nets on doors and windows", ["Present", "Absent"], 1),
  ]),
  TA("physicalEnvComment", "Comment on physical environment & recommendations (~200 words)", 1),

  SEC("Biological environment"),
  MULTI("pets", "Pets", [
    S("dogPresent", "Dog present?", ["Yes", "No"], 1),
    S("catPresent", "Cat present?", ["Yes", "No"], 1),
    S("dogImmunised", "If dog present, immunised?", ["Yes", "No"]),
    S("fleasPresent", "Fleas on the animals?", ["Present", "Absent"], 1),
  ]),
  M("livestockTypes", "Presence of livestock", ["Fowls", "Cattle", "Pigs", "Goats", "Others"], 1),
  N("animalShedDistance", "Distance of coop/shed for animals (metres)", 1),
  MULTI("animalDisease", "Animal illness", [
    S("animalDiseaseYn", "Any disease in them?", ["Yes", "No"], 1),
    S("animalDied", "If yes, died in past year?", ["Yes", "No"]),
    T("animalDiedDetails", "If died, which animal and how many?"),
    S("animalAbortion", "Report of abortion in animals?", ["Yes", "No"], 1),
  ]),
  MULTI("pests", "Pests & vectors", [
    S("housefliesInside", "Houseflies inside the house", ["Present", "Absent"], 1),
    S("housefliesOutside", "Houseflies outside the house", ["Present", "Absent"], 1),
    S("cockroaches", "Cockroaches", ["Present", "Absent"], 1),
    S("mosquitoes", "Mosquitoes", ["Present", "Absent"], 1),
    S("molds", "Molds in furniture and walls", ["Present", "Absent"], 1),
    S("snakes", "Snakes spotted in/around house", ["Yes", "No"], 1),
  ]),
  TA("biologicalEnvComment", "Comment on biological environment & recommendations (~200 words)", 1),

  SEC("Chemical environment"),
  MULTI("industryExposure", "Industry exposure", [
    S("industryNearby", "Industries near the house/neighbourhood?", ["Yes", "No"], 1),
    T("industryType", "If yes, what type of industry/plant?"),
    S("smokeReachesHouse", "Does smoke from plant reach the house?", ["Yes", "No"]),
  ]),
  MULTI("sprayingInfo", "Vector control spraying", [
    S("sprayingDone", "Health dept. personnel spray houses/neighbourhood?", ["Yes", "No"], 1),
    T("sprayingPrecaution", "If yes, precaution taken? How often sprayed?"),
    T("sprayingProblem", "Has any family member had problems after spraying?", 1),
  ]),
  MULTI("chemicalsUse", "Household chemicals", [
    S("pesticideUse", "Family uses pesticides?", ["Yes", "No"], 1),
    S("insecticideUse", "Family uses insecticides?", ["Yes", "No"], 1),
    S("rodenticideUse", "Family uses rodenticides?", ["Yes", "No"], 1),
    T("chemicalStorage", "Where are these stored?"),
    S("chemicalsOutOfReach", "Out of reach of children?", ["Yes", "No"], 1),
  ]),

  SEC("Social & economic data"),
  MULTI("landOwnership", "Land & house ownership", [
    S("landOwned", "Ownership of land", ["Yes", "No"], 1),
    T("landArea", "If yes, total land area owned"),
    S("arableLand", "Ownership of arable land", ["Yes", "No"], 1),
    S("houseOwned", "Ownership of house", ["Yes", "No"], 1),
    N("houseRent", "If no, monthly house rent (₹)"),
  ]),
  T("caste", "Caste", 1),
  T("livestockTypeNumber", "Type and number of livestock", 1),
  MULTI("homeIndustry", "Home industry & vehicles", [
    S("homeIndustryPresent", "Home run industry?", ["Yes", "No"], 1),
    T("homeIndustryDetail", "If yes, what is it?"),
    S("vehicleOwned", "Vehicle in the house", ["Cycle", "Motorbike/scooter/moped", "Car", "None"], 1),
  ]),
  M("householdFacilities", "Other available facilities", ["Refrigerator", "Television", "Washing machine", "Landline phone", "Mobile/Smartphone"], 1),
  MULTI("customsBeliefs1", "Customs & beliefs — I", [
    TA("customPregnancy", "Pregnancy", 1),
    TA("customChildbirth", "Childbirth", 1),
    TA("customPostpartum", "Postpartum period", 1),
    TA("customBreastfeeding", "Breastfeeding", 1),
    TA("customWeaning", "Weaning", 1),
  ]),
  MULTI("customsBeliefs2", "Customs & beliefs — II", [
    TA("customMenarche", "Menarche", 1),
    TA("customDiarrhoea", "Diarrhoeal diseases", 1),
    TA("customARI", "ARI in children", 1),
    TA("customAdultSickness", "Sickness in adults", 1),
    TA("customElderlyCare", "Elderly care", 1),
  ]),
  M("specialNeeds", "Family members with special needs", ["Intellectually challenged child/adult", "Bedridden", "Physically challenged", "Deaf mute", "Blind", "Others"], 1),
  MULTI("healthInsurance", "Health insurance", [
    S("insurancePresent", "Family has health insurance?", ["Yes", "No"], 1),
    T("insuranceCompany", "If yes, which company?"),
    N("insurancePremium", "Premium per person per year (₹)"),
    S("insuranceUsed", "Have you utilised the health insurance?", ["Yes", "No"], 1),
    T("insuranceUseDetail", "If yes, how many times & amount utilised"),
  ]),
  MULTI("addictionsInFamily", "Addictions in family", [
    S("alcoholInFamily", "Anyone takes alcohol?", ["Yes", "No"], 1),
    T("alcoholWho", "If yes, which member?"),
    S("smokingInFamily", "Anyone smokes?", ["Yes", "No"], 1),
    T("smokingWho", "If yes, which member?"),
    S("narcoticInFamily", "Anyone takes narcotic drugs?", ["Yes", "No"], 1),
    T("narcoticWho", "If yes, which member?"),
  ]),
  MULTI("socialIssues", "Social & legal", [
    S("dowryExists", "Does dowry system exist in the community?", ["Yes", "No"], 1),
    N("dowryAmount", "If yes, amount involved (₹)"),
    S("legalProblem", "Anyone in family has legal problems?", ["Yes", "No"], 1),
    T("legalProblemDetail", "If yes, what kind?"),
  ]),
  MULTI("incomeBreakdown", "Income (₹ per month)", [
    N("incomeAgriculture", "From agriculture"),
    N("incomeSalary", "From salary"),
    N("incomeOther", "From others"),
    N("totalFamilyIncome", "Total family income", 1),
    N("perCapitaIncome", "Per capita income", 1),
  ]),
  MULTI("expenditureBreakdown", "Monthly expenditure (₹)", [
    N("expFood", "Food"),
    N("expEducation", "Children's education"),
    N("expMedical", "Medical supplies"),
    N("expSavings", "Savings"),
  ]),
  TA("socioeconomicComment", "Comment on socioeconomic factors (~100 words)", 1),

  SEC("Udai Pareek socioeconomic scale"),
  MULTI("pareek1", "Score — part I", [
    S("pareekCaste", "Caste", ["Scheduled caste", "Lower caste", "Artisan caste", "Agriculture caste", "Prestige caste", "Dominant caste"], 1),
    S("pareekOccupation", "Occupation", ["None", "Labourer", "Caste occupation", "Business", "Independent profession", "Cultivation", "Service"], 1),
    S("pareekSocial", "Social participation", ["None", "Member of one organisation", "Member of more than one organisation", "Office holder in such an organisation", "Wide public leader"], 1),
    S("pareekHouse", "House", ["No house", "Hut", "Kutcha house", "Mixed house", "Pucca house", "Mansion"], 1),
  ]),
  MULTI("pareek2", "Score — part II", [
    S("pareekEducation", "Education", ["Illiterate", "Can read only", "Can read and write", "Primary", "Middle", "High school", "Graduate and above"], 1),
    S("pareekLand", "Land", ["No land", "<1 acre", "1-5 acre", "5-10 acre", "10-15 acre", "15-20 acre", ">20 acre"], 1),
    S("pareekPossessions", "Material possessions", ["None", "Bullock cart", "Cycle", "Radio", "Chairs", "Mobile phone", "Television", "Refrigerator"], 1),
    S("pareekFamilySize", "Family member", ["Up to 5", ">5"], 1),
    S("pareekFarmPower", "Farm power", ["No draft animals", "1-2 draft animals", "3-4 draft animals", "5-6 draft animals"], 1),
  ]),

  SEC("Illness in the family"),
  REPEAT("acuteIllness", "Acute illness (past 1 year)", "acute illness episode", [
    MULTI("ai_identity", "Who", [T("ai_name", "Name", 1), N("ai_age", "Age", 1), S("ai_sex", "Sex", ["Male", "Female"], 1)]),
    MULTI("ai_details", "Details", [T("ai_disease", "Disease", 1), T("ai_duration", "Duration", 1), T("ai_whereTreated", "Where was it treated?", 1), T("ai_statusNow", "Status now", 1)]),
  ]),
  REPEAT("chronicIllness", "Chronic illness", "chronic illness episode", [
    MULTI("ci_identity", "Who", [T("ci_name", "Name", 1), N("ci_age", "Age", 1), S("ci_sex", "Sex", ["Male", "Female"], 1)]),
    MULTI("ci_details", "Details", [T("ci_disease", "Disease", 1), T("ci_duration", "Duration (since when?)", 1), Y("ci_treatmentRegular", "Is the treatment regular?", 1), T("ci_whereTreating", "Where is treatment going on?", 1), T("ci_statusNow", "Status now", 1)]),
  ]),
  T("irregularTreatmentCause", "If any member's treatment is not regular, the cause", 1),
  TA("healthcareProblems", "Problems faced by the family in seeking health care", 1),
];

const ANTENATAL_SCHEMA = [
  SEC("Antenatal mother — basic details"),
  T("name", "Name", 1),
  N("age", "Age", 1),
  S("education", "Education", ["Illiterate", "Can read only", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
  T("occupation", "Occupation", 1),
  N("income", "Income (₹)"),
  PH("mobile", "Mobile number"),
  MULTI("husbandInfo", "Husband", [
    T("husbandName", "Name"),
    S("husbandEducation", "Education", ["Illiterate", "Can read only", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
    N("husbandIncome", "Income (₹)", 1),
  ]),

  SEC("Pregnancy registration"),
  Y("pregnancyWanted", "Is the pregnancy wanted?", 1),
  Y("pregnancyRegistered", "Is the pregnancy registered?", 1),
  IF(
    MULTI("registrationDetails", "If registered", [
      T("registeredWhere", "Where was it registered?"),
      S("registeredMonth", "At which month was it registered?", ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"], 1),
      S("ancVisitsDone", "Antenatal visits done till date", ["One", "Two", "Three", "More than three"], 1),
    ]),
    "pregnancyRegistered",
    "Yes"
  ),
  DT("lmp", "Date of Last Menstrual Period", 1),
  DT("edd", "Expected Delivery Date", 1),
  MULTI("gpla", "Obstetric score", [
    N("gravida", "Gravida", 1),
    N("parity", "Parity"),
    N("abortions", "Abortions"),
    N("liveChildren", "Live children"),
    N("gestationWeeks", "Period of gestation (completed weeks)", 1),
  ]),
  TA("complaints", "Any complaints?"),
  TA("presentingComplaintsHistory", "History of presenting complaints"),

  SEC("Treatment & obstetric history"),
  MULTI("ifaTd", "IFA & Td", [
    N("ifaReceived", "IFA tablets received"),
    N("ifaConsumed", "IFA tablets consumed"),
    DT("td1Date", "Date of 1st Td injection"),
    DT("td2Date", "Date of 2nd Td injection"),
  ]),
  TA("otherMeds", "Other medications taken", 1),
  TA("obstetricHistory", "Obstetric history (previous pregnancies — outcome, complications)", 1),

  SEC("Menstrual & marital history"),
  MULTI("menstrualHistory", "Menstrual history", [
    N("menarcheAge", "Age at menarche (years)", 1),
    N("cycleLength", "Duration of menstrual cycle (days)", 1),
    N("periodDuration", "Duration of menstruation (days)", 1),
    N("padsPerDay", "Pads used per day"),
  ]),
  M("menstrualSymptoms", "Tick if happens during menstruation", ["Passage of clots", "Cramps", "Tenderness of breasts"], 1),
  MULTI("maritalHistory", "Marital history", [
    N("marriageAge", "Age at marriage (years)", 1),
    N("marriageDuration", "Duration of marriage (years)", 1),
    Y("consanguinity", "Consanguinity", 1),
  ]),
  TA("contraceptiveUsage", "Contraceptive usage (type and duration)", 1),
  TA("personalHistory", "Personal history", 1),
  TA("pastHistory", "Past history of illness and hospitalisation", 1),
  TA("socialHistory", "Social and environmental history of importance", 1),

  SEC("Knowledge, Attitudes and Practices"),
  MULTI("kap1", "KAP — part I", [
    TA("kapSelfcare", "Self-care in pregnancy", 1),
    TA("kapBirthPrep", "Birth preparedness (ASHA contact, ambulance)", 1),
    TA("kapChildbirth", "Childbirth", 1),
    TA("kapBreastfeeding", "Breastfeeding", 1),
    TA("kapWeaning", "Weaning", 1),
  ]),
  MULTI("kap2", "KAP — part II", [
    TA("kapChildcare", "Childcare", 1),
    TA("kapImmunisation", "Immunisation", 1),
    TA("kapFamilyPlanning", "Family planning", 1),
    TA("kapDiarrhoea", "Care during diarrhoea in children", 1),
    TA("kapARI", "Care during ARI in children", 1),
  ]),

  SEC("Examination"),
  TA("generalPhysicalExam", "General physical examination", 1),
  MULTI("vitals", "Vitals", [
    N("bpSys", "Systolic BP (mmHg)", 1),
    N("bpDia", "Diastolic BP (mmHg)", 1),
    N("pulseRate", "Pulse rate (per min)", 1),
    S("pallor", "Pallor", ["Present", "Absent"], 1),
    S("icterus", "Icterus", ["Present", "Absent"], 1),
    S("edema", "Edema", ["Present", "Absent"], 1),
  ]),
  TA("systemicExam", "Systemic examination", 1),
  TA("obstetricExam", "Obstetric examination", 1),
  TA("localExam", "Local examination, if relevant"),
  T("provisionalDiagnosis", "Provisional diagnosis", 1),

  SEC("Investigations"),
  MULTI("investigations1", "Investigations — I", [
    S("bloodGroup", "Blood grouping and Rh typing", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 1),
    D("hb1", "Haemoglobin test 1 (mg/dl)", 1),
    DT("hb1Date", "Date of Hb test 1", 1),
    D("hb2", "Haemoglobin test 2 (mg/dl)"),
    D("hb3", "Haemoglobin test 3 (mg/dl)"),
  ]),
  MULTI("investigations2", "Investigations — II", [
    S("vdrl", "VDRL", ["Reactive", "Non-reactive"], 1),
    S("hbsag", "HBsAg", ["Positive", "Negative"], 1),
    S("hiv", "HIV", ["Reactive", "Non-reactive"], 1),
    S("usgCount", "Number of ultrasounds done till date", ["None", "One", "Two", "Three", "More than three"], 1),
  ]),
  TA("usgFindings", "Ultrasound findings with date"),
  T("finalDiagnosis", "Final diagnosis", 1),

  SEC("Plan & coordination"),
  TA("influencingFactors", "Factors in the woman & environment influencing her health", 1),
  TA("treatmentGiven", "Treatment given"),
  TA("adviceGiven", "Advice given"),
  TA("coordination", "Coordination with other agencies, if required"),
];

const POSTNATAL_SCHEMA = [
  SEC("Postnatal mother — basic details"),
  T("name", "Name", 1),
  N("age", "Age", 1),
  S("education", "Education", ["Illiterate", "Can read only", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
  T("occupation", "Occupation", 1),
  N("income", "Income (₹)"),
  PH("mobile", "Mobile number"),
  MULTI("husbandInfo", "Husband", [
    T("husbandName", "Name", 1),
    S("husbandEducation", "Education", ["Illiterate", "Can read only", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
    N("husbandIncome", "Income (₹)", 1),
  ]),

  SEC("This pregnancy"),
  Y("pregnancyWanted", "Was the pregnancy wanted?", 1),
  Y("pregnancyRegistered", "Was the pregnancy registered?", 1),
  IF(
    MULTI("registrationDetails", "If registered", [
      S("registeredMonth", "At which month was it registered?", ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"], 1),
      S("ancVisitsDone", "Antenatal visits done till date", ["One", "Two", "Three", "More than three"], 1),
    ]),
    "pregnancyRegistered",
    "Yes"
  ),
  MULTI("obstetricScore", "Obstetric score", [N("parity", "Parity", 1), N("abortions", "Abortions", 1), N("liveChildren", "Live children", 1)]),
  TA("motherComplaints", "Chief complaints of mother"),
  TA("newbornComplaints", "Chief complaints of newborn (as said by mother)"),
  TA("presentingHistory", "History of presenting complaints"),

  SEC("Delivery & newborn at birth"),
  MULTI("deliveryDetails1", "Delivery — I", [
    S("newbornSex", "Sex of newborn", ["Male", "Female"], 1),
    N("gestationAtBirth", "Period of gestation at birth (completed weeks)", 1),
    S("deliveryMode", "Mode of delivery", ["Normal vaginal delivery", "Forceps", "Vacuum", "LSCS"], 1),
    S("presentation", "Presentation at birth", ["Cephalic", "Breech"], 1),
  ]),
  MULTI("deliveryDetails2", "Delivery — II", [
    S("meconium", "Meconium passage during birth", ["Present", "Absent"], 1),
    Y("criedImmediately", "Baby cried immediately after birth", 1),
    D("birthWeight", "Birth weight (kg)", 1),
    Y("episiotomy", "Episiotomy given", 1),
  ]),
  M("postpartumComplications", "Postpartum complications", ["Postpartum Bleeding", "Uterine Inversion", "Placental complications"]),
  MULTI("earlyFeeding", "Early newborn care", [
    N("breastfeedingStartHours", "Hours until breastfeeding started"),
    Y("prelacteal", "Any prelacteal feeds given?", 1),
    Y("colostrum", "Was colostrum given?", 1),
    Y("vitaminK", "Inj. Vitamin K given?", 1),
    Y("bcg", "BCG given?", 1),
    Y("hepBBirth", "Hepatitis B birth dose given?", 1),
  ]),
  N("totalWeightGain", "Total weight gain during pregnancy (kg)", 1),
  MULTI("ifaTd", "IFA & Td", [N("ifaReceived", "IFA tablets received"), N("ifaConsumed", "IFA tablets consumed"), DT("td1Date", "Date of 1st Td injection"), DT("td2Date", "Date of 2nd Td injection")]),
  TA("trimesterHistory", "History of 1st / 2nd / 3rd trimester", 1),
  TA("obstetricHistory", "Obstetric history", 1),
  TA("personalHistory", "Personal history", 1),
  TA("familyHistory", "Family history", 1),
  TA("socialHistory", "Social and environmental history of importance", 1),

  SEC("Examination — mother"),
  TA("generalPhysicalExam", "General physical examination", 1),
  MULTI("vitals", "Vitals", [
    N("bpSys", "Systolic BP (mmHg)", 1),
    N("bpDia", "Diastolic BP (mmHg)", 1),
    N("pulseRate", "Pulse rate (per min)", 1),
    S("pallor", "Pallor", ["Present", "Absent"], 1),
    S("edema", "Edema", ["Present", "Absent"], 1),
  ]),
  TA("systemicExamMother", "Systemic exam (Anthropometry, breast, thyroid, per-abdominal, per-vaginal, episiotomy wound)", 1),
  MULTI("investigationsMother", "Investigations", [
    S("bloodGroup", "Blood grouping and Rh typing", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 1),
    D("hb1", "Haemoglobin (mg/dl)", 1),
    S("vdrl", "VDRL", ["Reactive", "Non-reactive"], 1),
    S("hbsag", "HBsAg", ["Positive", "Negative"], 1),
    S("hiv", "HIV", ["Reactive", "Non-reactive"], 1),
  ]),

  SEC("Examination — newborn"),
  MULTI("newbornExam1", "General", [
    S("activity", "Activity on examination", ["Active", "Sleeping", "Crying"], 1),
    S("cry", "Cry", ["Good", "Poor"], 1),
    S("feeding", "Feeding", ["Good", "Poor"], 1),
    S("newbornIcterus", "Icterus", ["Present", "Absent"], 1),
  ]),
  MULTI("newbornVitalsAnthro", "Vitals & anthropometry", [
    N("heartRate", "Heart rate (per min)", 1),
    N("temperature", "Temperature (°F)", 1),
    N("respRate", "Respiratory rate (per min)", 1),
    N("newbornWeight", "Weight (kg)"),
    N("headCirc", "Head circumference (cm)"),
    N("chestCirc", "Chest circumference (cm)", 1),
  ]),
  MULTI("newbornExam2", "Findings", [
    S("anteriorFontanelle", "Anterior fontanelle", ["Open", "Closed"], 1),
    S("birthInjury", "Birth injury marks", ["Present", "Absent"], 1),
    S("mouthAbnormality", "Mouth", ["None", "Cleft lip", "Cleft palate", "Both"], 1),
    S("umbilicalCord", "Umbilical cord", ["Redness", "Discharge", "None"], 1),
  ]),
  MULTI("newbornReflexes", "Reflexes", [
    S("palmarGrasp", "Palmar grasp", ["Present", "Absent"], 1),
    S("rootingReflex", "Rooting reflex", ["Present", "Absent"], 1),
    S("suckingReflex", "Sucking reflex", ["Present", "Absent"], 1),
    S("moroReflex", "Moro's reflex", ["Present", "Absent"], 1),
  ]),
  TA("maturityAssessment", "Maturity assessment (hair, sole crease, ear, breast nodule, genitalia)", 1),
  TA("newbornSystemicExam", "Systemic examination findings", 1),

  SEC("Knowledge, Attitudes and Practices"),
  MULTI("kapA", "KAP — part I", [
    TA("kapRest", "Adequate rest & increased food intake", 1),
    TA("kapHygiene", "Hygiene, episiotomy care, breast care", 1),
    TA("kapBreastProblems", "Common breast problems & danger signs", 1),
    TA("kapCheckup", "Regular checkup", 1),
  ]),
  MULTI("kapB", "KAP — part II", [
    TA("kapImmunisation", "Immunisation & growth monitoring", 1),
    TA("kapExclusiveBF", "Exclusive breastfeeding (duration & frequency)", 1),
    TA("kapComplementary", "Complementary feeding", 1),
    TA("kapContraception", "Contraception (abstinence 6 weeks, spacing)", 1),
  ]),
  MULTI("kapC", "KAP — part III", [
    TA("kapWarmth", "Keeping baby warm", 1),
    TA("kapASHA", "Role of ASHA", 1),
    TA("kapDangerSigns", "Danger signs in child", 1),
  ]),

  SEC("Final"),
  MULTI("babyLabs", "Baby's labs", [N("babyHb", "Hb of baby (g/dl)", 1), S("babyBloodGroup", "Blood group of baby", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 1)]),
  TA("influencingFactors", "Factors in the woman & environment influencing her health", 1),
  TA("treatmentGiven", "Treatment given"),
  TA("adviceGiven", "Advice given"),
];

const UNDERFIVE_SCHEMA = [
  SEC("Child — basic details"),
  T("name", "Name", 1),
  D("age", "Age (years)", 1),
  S("sex", "Sex", ["Male", "Female"], 1),
  MULTI("parentInfo", "Parents", [
    T("fatherName", "Father's name", 1),
    T("motherName", "Mother's name", 1),
    S("fatherEducation", "Father's education", ["Illiterate", "Can read", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
    S("motherEducation", "Mother's education", ["Illiterate", "Can read", "Can read and write", "Primary school", "Middle school", "High school", "Graduate and above"], 1),
  ]),
  MULTI("familyIncome", "Income (₹/month)", [N("fatherIncome", "Father's income", 1), N("motherIncome", "Mother's income", 1), N("totalFamilyIncome", "Total family income", 1)]),
  N("birthOrder", "Birth order", 1),
  TA("birthHistory", "Birth history"),

  SEC("Immunisation status (dates)"),
  MULTI("immunisationPrimary", "Primary series", [
    DT("bcg", "BCG"),
    DT("opv0", "OPV-0"),
    DT("hepBBirth", "HepB (birth dose)"),
    DT("penta1", "Penta-1"),
    DT("penta2", "Penta-2"),
    DT("penta3", "Penta-3"),
  ]),
  MULTI("immunisationOPVother", "OPV, Rota, IPV, PCV", [
    DT("opv1", "OPV-1"),
    DT("opv2", "OPV-2"),
    DT("opv3", "OPV-3"),
    DT("rota1", "Rotavirus-1"),
    DT("rota2", "Rotavirus-2"),
    DT("rota3", "Rotavirus-3"),
    DT("ipv1", "IPV-1"),
    DT("ipv2", "IPV-2"),
    DT("pcv1", "PCV-1"),
    DT("pcv2", "PCV-2"),
  ]),
  MULTI("immunisationBoosters", "Boosters & vitamin A", [
    DT("mr1", "MR-1"),
    DT("mr2", "MR-2"),
    DT("je1", "JE-1"),
    DT("je2", "JE-2"),
    DT("opvBooster", "OPV booster"),
    DT("dpt1", "DPT 1st booster"),
    DT("dpt2", "DPT 2nd booster"),
    DT("vitA1", "Vitamin A-1"),
    DT("vitA2", "Vitamin A-2"),
    DT("vitA3", "Vitamin A-3"),
  ]),

  SEC("Development"),
  MULTI("milestones", "Milestones", [
    TA("grossMotor", "Gross motor milestones", 1),
    TA("fineMotor", "Fine motor milestones"),
    TA("language", "Language milestones"),
    TA("social", "Social milestones"),
  ]),

  SEC("History"),
  T("complaints", "Any complaints?", 1),
  TA("presentIllness", "History of present illness", 1),
  TA("treatmentHistory", "Treatment history", 1),
  TA("pastHistory", "Past history", 1),
  TA("socialHistory", "Socio-environmental history of importance", 1),
  TA("familyHistory", "Family history", 1),

  SEC("Examination"),
  TA("generalPhysicalExam", "General physical examination", 1),
  MULTI("anthropometry", "Anthropometry", [
    N("weight", "Weight (kg)", 1),
    N("height", "Height/length (cm)", 1),
    N("headCirc", "Head circumference (cm)", 1),
    N("chestCirc", "Chest circumference (cm)", 1),
    N("muac", "MUAC (cm)", 1),
  ]),
  TA("systemicExam", "Systemic examination", 1),
  TA("investigations", "Investigations"),
  TA("pharmacological", "Pharmacological treatment"),
  TA("nonPharmacological", "Non-pharmacological measures"),
];

const CHRONIC_SCHEMA = [
  SEC("Member — basic details"),
  T("name", "Name", 1),
  N("age", "Age (years)", 1),
  S("sex", "Sex", ["Male", "Female"], 1),
  N("totalFamilyIncome", "Total family income", 1),
  T("diseaseName", "What disease is the person suffering from?", 1),
  Y("symptomsNow", "Having symptoms now?", 1),
  IF(TA("symptomsDescription", "Describe the symptoms", 1), "symptomsNow", "Yes"),
  Y("complications", "Suffered any complications?", 1),
  IF(TA("complicationsDescription", "What complications?", 1), "complications", "Yes"),
  N("diagnosisYearsAgo", "How long ago was diagnosis made (years)?", 1),
  Y("regularTreatment", "On regular treatment?", 1),
  IF(MULTI("treatmentDetails", "Treatment", [T("treatmentSource", "Where is treatment taken from?", 1), TA("treatmentTaken", "What treatment is being taken?", 1)]), "regularTreatment", "Yes"),
  T("followUpFrequency", "How often does the patient visit the doctor for follow-up?", 1),
  TA("investigationsHistory", "Investigations undergone, with frequency and values"),
  Y("diseaseControlled", "Is the disease/symptoms under control?", 1),

  SEC("Tobacco, alcohol & drugs"),
  S("tobaccoUse", "Smoke / smokeless tobacco use", ["Yes (Smoking)", "Yes (Smokeless tobacco)", "None"], 1),
  IF(
    MULTI("smokingDetails", "Smoking details", [
      S("smokingType", "What does he take?", ["Cigarette", "Bidi", "Cigar"], 1),
      N("smokingPerDay", "Number taken per day", 1),
      N("smokingYears", "Years smoking", 1),
      N("packYears", "Pack years", 1),
    ]),
    "tobaccoUse",
    "Yes (Smoking)"
  ),
  IF(
    MULTI("fagerstromSmoking", "Smoking dependence screen", [
      S("firstUnitTime", "How soon after waking do you smoke your first unit?", ["Within 5 minutes", "6-30 minutes", "31-60 minutes", "After 60 minutes"], 1),
      S("difficultRefrain", "Difficult to refrain where forbidden?", ["Yes", "No"], 1),
      S("smokeWhenIll", "Smoke even if ill in bed most of day?", ["Yes", "No"], 1),
    ]),
    "tobaccoUse",
    "Yes (Smoking)"
  ),
  IF(
    MULTI("smokelessDetails", "Smokeless tobacco details", [
      S("smokelessType", "What kind consumed?", ["Khaini", "Gutkha without paan", "Guraku", "Snuff", "Gutkha with paan"], 1),
      N("smokelessGramsPerDay", "Amount (g) per day", 1),
      S("smokelessFirstDipTime", "How soon after waking do you place first dip?", ["Within 5 min", "6 - 30 min", "31 – 60 min", "After 60 min"], 1),
      S("cansPerWeek", "Cans/pouches per week", ["More than 3", "2-3", "1"], 1),
    ]),
    "tobaccoUse",
    "Yes (Smokeless tobacco)"
  ),
  Y("alcoholUse", "Does the patient consume alcohol?", 1),
  IF(
    MULTI("alcoholDetails", "Alcohol details", [
      S("alcoholFrequency", "How often does he/she drink?", ["Never", "Monthly or less", "2-4 times per month", "2-3 times per week", "4+ times per week"], 1),
      S("alcoholUnitsTypical", "Units on a typical drinking day", ["1-2", "3-4", "5-6", "7-9", "10+"], 1),
      N("alcoholSpend", "Monthly spend on alcohol (₹)", 1),
    ]),
    "alcoholUse",
    "Yes"
  ),
  Y("narcoticUse", "Does the patient take any narcotic drug?", 1),
  IF(
    MULTI("narcoticDetails", "Narcotic drug details", [T("narcoticWhat", "What does he/she take?", 1), T("narcoticFrequency", "How often?", 1), N("narcoticSpend", "Monthly spend (₹)", 1)]),
    "narcoticUse",
    "Yes"
  ),
  Y("physicalActivity", "Does the patient undertake physical activity?", 1),
  IF(
    MULTI("physicalActivityDetails", "Activity details", [S("activityType", "What does he/she do?", ["Walking/jogging", "Gym", "Yoga"], 1), N("activityDuration", "Duration of each session (min)", 1)]),
    "physicalActivity",
    "Yes"
  ),

  SEC("History & examination"),
  TA("personalHistory", "Personal history", 1),
  TA("pastHistory", "Past history", 1),
  TA("socialHistory", "Social & environmental history of importance", 1),
  MULTI("anthropometry", "Anthropometry", [N("weight", "Weight (kg)", 1), N("waistCirc", "Waist circumference (cm)", 1), N("hipCirc", "Hip circumference (cm)", 1)]),
  MULTI("systemicExam", "Systemic examination", [TA("respiratorySystem", "Respiratory system", 1), TA("cvs", "CVS", 1), TA("abdomen", "Abdomen", 1)]),
  TA("investigationsWithDate", "Investigations (with date)", 1),
  S("riskAssessment", "Risk assessment (WHO-ISH chart)", ["<10%", "10 to <20%", "20 to <30%", "30 to <40%", ">=40%"], 1),

  SEC("Plan"),
  TA("pharmacological", "Pharmacological treatment", 1),
  TA("nonPharmacological", "Non-pharmacological measures"),
  MULTI("interventionLevels", "Interventions", [TA("familyInterventions", "At family level", 1), TA("communityInterventions", "At community level", 1), TA("programmeInterventions", "At programme level", 1)]),
];

const GERIATRIC_SCHEMA = [
  SEC("Member — basic details"),
  T("name", "Name", 1),
  N("age", "Age (years)", 1),
  S("sex", "Sex", ["Male", "Female"], 1),

  SEC("Chief complaints, system-wise"),
  M("locomotiveComplaints", "Locomotive", ["Joint stiffness", "Pain", "Swelling", "Bone deformity", "Limited range of movements", "None"], 1),
  M("neuroComplaints", "Neurological", ["Syncope", "Memory loss", "Dizziness", "Falls", "Incoordination", "Paralysis", "None"], 1),
  M("cvsComplaints", "CVS", ["Dyspnea", "Oedema", "Palpitations", "Hypertension", "Diabetes", "Coronary heart disease", "None"], 1),
  M("rsComplaints", "Respiratory", ["Cough", "Sputum", "Hemoptysis", "None"], 1),
  M("skinComplaints", "Skin", ["Itching", "Pigmentation", "None"], 1),
  M("giComplaints", "GI", ["Appetite change", "Heartburns", "Constipation", "Diarrhea", "Dysphagia", "None"], 1),
  M("psychComplaints", "Psychiatric", ["Depression", "Sleep disturbance", "None"], 1),
  M("guComplaints", "Genitourinary", ["Frequency", "Urgency", "Dribbling", "Force of stream changes", "Utero-vaginal prolapse", "None"], 1),
  M("visionHearingComplaints", "Vision & hearing", ["Visual changes", "Hearing loss", "Vertigo", "Tinnitus", "None"], 1),
  M("disabilities", "Disabilities — explore difficulties", ["Vision", "Hearing", "Locomotion", "Use of public transport", "None"], 1),

  SEC("Social & financial support"),
  TA("familySupport", "Family support where physical disabilities affect social life", 1),
  MULTI("financialSupport", "Financial support", [Y("benefitsReceived", "Benefits received"), N("benefitAmount", "Amount of money per month (₹)")]),

  SEC("Geriatric Depression Scale — 15 item (short form)"),
  MULTI("gdsA", "Items 1–5", [
    Y("gds1", "Are you basically satisfied with your life?", 1),
    Y("gds2", "Have you dropped many of your activities and interests?", 1),
    Y("gds3", "Do you feel that your life is empty?", 1),
    Y("gds4", "Do you often get bored?", 1),
    Y("gds5", "Are you in good spirits most of the time?", 1),
  ]),
  MULTI("gdsB", "Items 6–10", [
    Y("gds6", "Are you afraid that something bad is going to happen to you?", 1),
    Y("gds7", "Do you feel happy most of the time?", 1),
    Y("gds8", "Do you often feel helpless?", 1),
    Y("gds9", "Do you prefer to stay at home, rather than go out and do new things?", 1),
    Y("gds10", "Do you feel you have more problems with memory than most?", 1),
  ]),
  MULTI("gdsC", "Items 11–15", [
    Y("gds11", "Do you think it is wonderful to be alive now?", 1),
    Y("gds12", "Do you feel pretty worthless the way you are now?", 1),
    Y("gds13", "Do you feel full of energy?", 1),
    Y("gds14", "Do you feel that your situation is hopeless?", 1),
    Y("gds15", "Do you think that most people are better off than you are?", 1),
  ]),

  SEC("Katz Index of Independence in ADL"),
  MULTI("katzADL", "Score 1 = independent, 0 = needs help", [
    Y("katzBathing", "Bathing — independent?"),
    Y("katzDressing", "Dressing — independent?"),
    Y("katzToileting", "Toileting — independent?"),
    Y("katzTransferring", "Transferring — independent?"),
    Y("katzContinence", "Continence — independent?"),
    Y("katzFeeding", "Feeding — independent?"),
  ]),

  SEC("Lawton–Brody Instrumental ADL Scale"),
  MULTI("iadl1", "Telephone, shopping, food, housekeeping", [
    S("iadlPhone", "Ability to use telephone", ["Operates independently", "Dials a few well-known numbers", "Answers but does not dial", "Does not use telephone at all"], 1),
    S("iadlShopping", "Shopping", ["Independent", "Independent for small purchases", "Needs accompaniment", "Unable to shop"], 1),
    S("iadlFoodPrep", "Food preparation", ["Plans/prepares/serves independently", "Prepares if supplied with ingredients", "Heats/serves but does not maintain diet", "Needs meals prepared and served"], 1),
    S("iadlHousekeeping", "Housekeeping", ["Maintains house independently", "Performs light daily tasks", "Performs light tasks but not to acceptable level", "Needs help with all tasks / does not participate"], 1),
  ]),
  MULTI("iadl2", "Laundry, transport, medication, finances", [
    S("iadlLaundry", "Laundry", ["Does personal laundry completely", "Launders small items", "All laundry done by others"], 1),
    S("iadlTransport", "Mode of transportation", ["Travels independently", "Arranges own taxi, not public transport", "Travels on public transport with assistance", "Limited to taxi/car with assistance / does not travel"], 1),
    S("iadlMedication", "Responsibility for own medications", ["Responsible, correct dosage/time", "Takes if prepared in advance", "Not capable of dispensing own medication"], 1),
    S("iadlFinances", "Ability to handle finances", ["Manages independently", "Manages daily purchases, needs help with major ones", "Incapable of handling money"], 1),
  ]),

  SEC("Notes"),
  TA("geriatricNotes", "Additional notes"),
];

const ADOLESCENT_SCHEMA = [
  SEC("Adolescent — basic details"),
  T("name", "Name", 1),
  N("age", "Age (years)", 1),
  S("sex", "Sex", ["Girl", "Boy"], 1),

  SEC("History"),
  TA("pastHistory", "Past history", 1),
  TA("personalHistory", "Personal history", 1),
  MULTI("sleepHygiene", "Sleep", [N("sleepHours", "Usual hours of sleep per night"), TA("sleepIssues", "Sleep hygiene issues, if any")]),
  MULTI("addiction", "Addiction", [M("addictionTypes", "Any addiction", ["Tobacco", "Alcohol", "Smokeless tobacco", "Internet/gaming", "Other", "None"]), TA("addictionDetails", "Details, if any")]),
  TA("allergicHistory", "Allergic history"),
  MULTI("physicalActivity", "Physical activity", [N("activityMinPerWeek", "Minutes per week"), T("activityType", "Type of activity")]),
  TA("personalHygiene", "Personal hygiene"),
  TA("medicationHistory", "Current medications"),
  IF(
    MULTI("menstrualHistory", "Menstrual history", [
      T("menarcheAge", "Age at menarche"),
      T("cycleRegularity", "Cycle regularity"),
      T("usualFlow", "Usual flow (light/moderate/heavy, days)"),
      TA("menstrualComplaints", "Menstrual complaints, if any"),
    ]),
    "sex",
    "Girl"
  ),

  SEC("Psychosocial history"),
  TA("psychosocialHistory", "Psychosocial history (school, peers, family, stressors)", 1),
];

/* ============================================================
   CATEGORY METADATA
============================================================ */
const CARD_CATEGORIES = [
  { key: "antenatal", label: "Antenatal Mother", schema: ANTENATAL_SCHEMA, nameField: "name" },
  { key: "postnatal", label: "Postnatal Mother & Newborn", schema: POSTNATAL_SCHEMA, nameField: "name" },
  { key: "underfive", label: "Under-five Child", schema: UNDERFIVE_SCHEMA, nameField: "name" },
  { key: "chronic", label: "Chronic Disease", schema: CHRONIC_SCHEMA, nameField: "name" },
  { key: "geriatric", label: "Geriatric Assessment", schema: GERIATRIC_SCHEMA, nameField: "name" },
  { key: "adolescent", label: "Adolescent Health", schema: ADOLESCENT_SCHEMA, nameField: "name" },
];
function categoryMeta(key) {
  return CARD_CATEGORIES.find((c) => c.key === key);
}


export const SCHEMAS = {
  family: FAMILY_SCHEMA,
  antenatal: ANTENATAL_SCHEMA,
  postnatal: POSTNATAL_SCHEMA,
  underfive: UNDERFIVE_SCHEMA,
  chronic: CHRONIC_SCHEMA,
  geriatric: GERIATRIC_SCHEMA,
  adolescent: ADOLESCENT_SCHEMA,
};

export { FAMILY_SCHEMA, ANTENATAL_SCHEMA, POSTNATAL_SCHEMA, UNDERFIVE_SCHEMA, CHRONIC_SCHEMA, GERIATRIC_SCHEMA, ADOLESCENT_SCHEMA, CARD_CATEGORIES, categoryMeta };
