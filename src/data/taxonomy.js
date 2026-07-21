// ---------------------------------------------------------------------------
// TAXONOMY — structural backbone only. Contains NO neuroscience facts; it
// defines the browse structure and, per topic, *where* content comes from:
//
//   - section:  a chapter section of the Open Neuroscience Initiative textbook
//               (PRIMARY source for Neuroscience 101 — see src/data/oniContent.js)
//   - wiki:     an English Wikipedia article title (fallback content for the
//               other categories, used only where the curated sources lack it)
//   - query:    a search string for videos / literature
//
// Every category also surfaces the curated secondary sources in src/data/sources.js
// (BrainStuff, Neuroscience Online, BrainFacts, BIAA, Neuroscience News).
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  {
    id: 'ns101',
    name: 'Neuroscience 101',
    blurb:
      'A complete foundation, following the open-access textbook “Open Neuroscience Initiative” (Austin Lim, DePaul, CC BY-NC). 16 chapters from cells to disease.',
    layout: 'groups',
    featured: true,
    source: 'oni', // topics carry `section` → primary content from the textbook
    groups: [
      {
        name: 'Chapter 1 · Introduction',
        topics: [
          { id: 'oni-1-1', name: 'What is neuroscience?', section: '1.1', query: 'what is neuroscience' },
          { id: 'oni-1-2', name: 'How we learn about neuroscience', section: '1.2', query: 'neuroscience methods overview' },
          { id: 'oni-1-3', name: 'What neuroscience is NOT', section: '1.3', query: 'neuromyths neuroscience' },
          { id: 'oni-1-4', name: 'Neuroscience is ever changing', section: '1.4', query: 'history of neuroscience' },
          { id: 'oni-1-5', name: 'An integrative field of study', section: '1.5', query: 'interdisciplinary neuroscience' },
        ],
      },
      {
        name: 'Chapter 2 · Anatomy of the Nervous System',
        topics: [
          { id: 'oni-2-1', name: 'Central nervous system (CNS)', section: '2.1', query: 'central nervous system brain spinal cord' },
          { id: 'oni-2-2', name: 'Peripheral nervous system (PNS)', section: '2.2', query: 'peripheral nervous system' },
          { id: 'oni-2-3', name: 'Support structures of the nervous system', section: '2.3', query: 'meninges ventricles cerebrospinal fluid' },
        ],
      },
      {
        name: 'Chapter 3 · Cellular Anatomy',
        topics: [
          { id: 'oni-3-1', name: 'Characteristics of neurons', section: '3.1', query: 'neuron characteristics' },
          { id: 'oni-3-2', name: 'Cellular anatomy of neurons', section: '3.2', query: 'neuron structure axon dendrite' },
          { id: 'oni-3-3', name: 'Cellular functions of glia', section: '3.3', query: 'glia astrocyte oligodendrocyte' },
        ],
      },
      {
        name: 'Chapter 4 · Electrical Properties of Neurons',
        topics: [
          { id: 'oni-4-1', name: 'Ion channels', section: '4.1', query: 'ion channels neuron' },
          { id: 'oni-4-2', name: 'The electrochemical gradient', section: '4.2', query: 'electrochemical gradient membrane' },
          { id: 'oni-4-3', name: 'The Nernst equation', section: '4.3', query: 'Nernst equation equilibrium potential' },
          { id: 'oni-4-4', name: 'The action potential', section: '4.4', query: 'action potential' },
          { id: 'oni-4-5', name: 'Movement of action potentials', section: '4.5', query: 'action potential propagation saltatory' },
        ],
      },
      {
        name: 'Chapter 5 · Signaling Between Neurons',
        topics: [
          { id: 'oni-5-1', name: 'Electrical vs. chemical synapses', section: '5.1', query: 'electrical chemical synapse' },
          { id: 'oni-5-2', name: 'Properties of vesicles', section: '5.2', query: 'synaptic vesicle release' },
          { id: 'oni-5-3', name: 'Receptors', section: '5.3', query: 'neurotransmitter receptors ionotropic metabotropic' },
          { id: 'oni-5-4', name: 'Neurotransmitters', section: '5.4', query: 'neurotransmitters' },
        ],
      },
      {
        name: 'Chapter 6 · Methods of Neuroscience',
        topics: [
          { id: 'oni-6-1', name: 'Imaging brain activity', section: '6.1', query: 'EEG MEG brain activity imaging' },
          { id: 'oni-6-2', name: 'Imaging brain function', section: '6.2', query: 'fMRI PET brain function imaging' },
          { id: 'oni-6-3', name: 'Imaging the cells of the nervous system', section: '6.3', query: 'microscopy neuron imaging staining' },
          { id: 'oni-6-4', name: 'Changing nervous system activity', section: '6.4', query: 'optogenetics TMS lesion brain stimulation' },
        ],
      },
      {
        name: 'Chapter 7 · Vision',
        topics: [
          { id: 'oni-7-1', name: 'The eye', section: '7.1', query: 'eye anatomy vision' },
          { id: 'oni-7-2', name: 'The retina', section: '7.2', query: 'retina photoreceptors' },
          { id: 'oni-7-3', name: 'The optic nerve', section: '7.3', query: 'optic nerve visual pathway' },
          { id: 'oni-7-4', name: 'Visual perception in the brain', section: '7.4', query: 'visual cortex perception' },
        ],
      },
      {
        name: 'Chapter 8 · The Physical Senses',
        topics: [
          { id: 'oni-8-1', name: 'The auditory system', section: '8.1', query: 'auditory system hearing cochlea' },
          { id: 'oni-8-2', name: 'The vestibular system', section: '8.2', query: 'vestibular system balance' },
          { id: 'oni-8-3', name: 'The somatosensory system', section: '8.3', query: 'somatosensory touch pain' },
        ],
      },
      {
        name: 'Chapter 9 · The Chemical Senses',
        topics: [
          { id: 'oni-9-1', name: 'The olfactory system', section: '9.1', query: 'olfactory system smell' },
          { id: 'oni-9-2', name: 'The gustatory system', section: '9.2', query: 'gustatory system taste' },
          { id: 'oni-9-3', name: 'Internal chemosensory systems', section: '9.3', query: 'internal chemoreceptors' },
        ],
      },
      {
        name: 'Chapter 10 · The Motor System',
        topics: [
          { id: 'oni-10-1', name: 'Motor control in the brain', section: '10.1', query: 'motor cortex movement control' },
          { id: 'oni-10-2', name: 'Modifiers of descending information', section: '10.2', query: 'basal ganglia cerebellum movement' },
          { id: 'oni-10-3', name: 'The spinal cord', section: '10.3', query: 'spinal cord motor' },
          { id: 'oni-10-4', name: 'The muscles', section: '10.4', query: 'neuromuscular junction muscle' },
        ],
      },
      {
        name: 'Chapter 11 · Neuropharmacology & Substance Use',
        topics: [
          { id: 'oni-11-1', name: 'Common routes of administration', section: '11.1', query: 'drug routes of administration pharmacokinetics' },
          { id: 'oni-11-2', name: 'Neural circuitry of reward', section: '11.2', query: 'reward circuit dopamine nucleus accumbens' },
          { id: 'oni-11-3', name: 'Molecular pharmacodynamics', section: '11.3', query: 'pharmacodynamics receptor drug' },
          { id: 'oni-11-4', name: 'Commonly misused substances', section: '11.4', query: 'drugs of abuse neuroscience' },
          { id: 'oni-11-5', name: 'Tolerance, withdrawal & dependence', section: '11.5', query: 'tolerance withdrawal dependence' },
          { id: 'oni-11-6', name: 'Theories of addiction', section: '11.6', query: 'theories of addiction' },
        ],
      },
      {
        name: 'Chapter 12 · Sleep & the Circadian Rhythm',
        topics: [
          { id: 'oni-12-1', name: 'Phases of sleep', section: '12.1', query: 'sleep stages REM NREM' },
          { id: 'oni-12-2', name: 'Why do we sleep?', section: '12.2', query: 'why do we sleep function' },
          { id: 'oni-12-3', name: 'The circadian rhythm', section: '12.3', query: 'circadian rhythm suprachiasmatic' },
          { id: 'oni-12-4', name: 'Neurochemical signals of sleep & wake', section: '12.4', query: 'sleep wake neurotransmitters' },
          { id: 'oni-12-5', name: 'Brain structures involved in sleep', section: '12.5', query: 'sleep brain structures hypothalamus' },
          { id: 'oni-12-6', name: 'Sleep disorders', section: '12.6', query: 'sleep disorders insomnia narcolepsy' },
        ],
      },
      {
        name: 'Chapter 13 · Learning & Memory',
        topics: [
          { id: 'oni-13-1', name: 'Patient H.M.', section: '13.1', query: 'patient HM memory hippocampus' },
          { id: 'oni-13-2', name: 'Neural structures involved in learning', section: '13.2', query: 'hippocampus memory structures' },
          { id: 'oni-13-3', name: 'Cellular mechanisms of learning', section: '13.3', query: 'long-term potentiation synaptic plasticity' },
          { id: 'oni-13-4', name: 'Molecular mechanisms of learning', section: '13.4', query: 'molecular mechanisms memory CREB' },
          { id: 'oni-13-5', name: 'Disorders of memory', section: '13.5', query: 'amnesia memory disorders' },
        ],
      },
      {
        name: 'Chapter 14 · Lateralization & Language',
        topics: [
          { id: 'oni-14-1', name: 'Lateralization', section: '14.1', query: 'brain lateralization split brain' },
          { id: 'oni-14-2', name: 'Language', section: '14.2', query: 'language brain Broca Wernicke' },
        ],
      },
      {
        name: 'Chapter 15 · Emotion',
        topics: [
          { id: 'oni-15-1', name: 'A history of emotion research', section: '15.1', query: 'history emotion research James-Lange' },
          { id: 'oni-15-2', name: 'Structures involved in emotion', section: '15.2', query: 'amygdala limbic emotion' },
          { id: 'oni-15-3', name: 'Specific emotions', section: '15.3', query: 'fear disgust emotion neuroscience' },
        ],
      },
      {
        name: 'Chapter 16 · Diseases of the Brain',
        topics: [
          { id: 'oni-16-1', name: 'Schizophrenia', section: '16.1', query: 'schizophrenia neuroscience' },
          { id: 'oni-16-2', name: 'Major depressive disorder', section: '16.2', query: 'major depressive disorder' },
          { id: 'oni-16-3', name: 'Bipolar disorder', section: '16.3', query: 'bipolar disorder' },
          { id: 'oni-16-4', name: 'Anxiety disorders', section: '16.4', query: 'anxiety disorders' },
        ],
      },
    ],
  },

  {
    id: 'anatomy',
    name: 'Anatomy / Structure',
    blurb: 'The physical architecture of the nervous system — regions, cells, and circuits.',
    layout: 'grid',
    topics: [
      { id: 'cortex', name: 'Cerebral cortex', wiki: 'Cerebral cortex', query: 'cerebral cortex' },
      { id: 'limbic', name: 'Limbic system', wiki: 'Limbic system', query: 'limbic system' },
      { id: 'basal-ganglia', name: 'Basal ganglia', wiki: 'Basal ganglia', query: 'basal ganglia' },
      { id: 'thalamus', name: 'Thalamus', wiki: 'Thalamus', query: 'thalamus' },
      { id: 'hypothalamus', name: 'Hypothalamus', wiki: 'Hypothalamus', query: 'hypothalamus' },
      { id: 'brainstem', name: 'Brainstem', wiki: 'Brainstem', query: 'brainstem' },
      { id: 'cerebellum', name: 'Cerebellum', wiki: 'Cerebellum', query: 'cerebellum' },
      { id: 'hippocampus', name: 'Hippocampus', wiki: 'Hippocampus', query: 'hippocampus' },
      { id: 'amygdala', name: 'Amygdala', wiki: 'Amygdala', query: 'amygdala' },
      { id: 'neurons', name: 'Neurons', wiki: 'Neuron', query: 'neuron physiology' },
      { id: 'glia', name: 'Glial cells', wiki: 'Glia', query: 'glial cells' },
      { id: 'synapse', name: 'Synapse', wiki: 'Synapse', query: 'synapse' },
      { id: 'circuits', name: 'Neural circuits', wiki: 'Neural circuit', query: 'neural circuit' },
      { id: 'white-matter', name: 'White matter', wiki: 'White matter', query: 'white matter' },
      { id: 'grey-matter', name: 'Grey matter', wiki: 'Grey matter', query: 'grey matter brain' },
      { id: 'bbb', name: 'Blood–brain barrier', wiki: 'Blood–brain barrier', query: 'blood brain barrier' },
      { id: 'spinal-cord', name: 'Spinal cord', wiki: 'Spinal cord', query: 'spinal cord' },
      { id: 'cranial-nerves', name: 'Cranial nerves', wiki: 'Cranial nerves', query: 'cranial nerves' },
      { id: 'meninges', name: 'Meninges', wiki: 'Meninges', query: 'meninges' },
      { id: 'csf', name: 'Cerebrospinal fluid & ventricles', wiki: 'Cerebrospinal fluid', query: 'cerebrospinal fluid' },
    ],
  },

  {
    id: 'scale',
    name: 'Level of Analysis / Scale',
    blurb:
      'The classic neuroscience spine — from molecules up to social behaviour. Browse along the ladder.',
    layout: 'spine',
    topics: [
      { id: 'molecular', name: 'Molecular', wiki: 'Molecular neuroscience', query: 'molecular neuroscience' },
      { id: 'cellular', name: 'Cellular', wiki: 'Cellular neuroscience', query: 'cellular neuroscience' },
      { id: 'synaptic', name: 'Synaptic', wiki: 'Synaptic plasticity', query: 'synaptic transmission' },
      { id: 'circuit', name: 'Circuit', wiki: 'Neural circuit', query: 'neural circuit' },
      { id: 'systems', name: 'Systems', wiki: 'Systems neuroscience', query: 'systems neuroscience' },
      { id: 'cognitive', name: 'Cognitive', wiki: 'Cognitive neuroscience', query: 'cognitive neuroscience' },
      { id: 'behavioural', name: 'Behavioural', wiki: 'Behavioral neuroscience', query: 'behavioral neuroscience' },
      { id: 'social', name: 'Social', wiki: 'Social neuroscience', query: 'social neuroscience' },
    ],
  },

  {
    id: 'functions',
    name: 'Functions',
    blurb: 'What the brain does — the mental and behavioural capacities it supports.',
    layout: 'grid',
    topics: [
      { id: 'memory', name: 'Memory', wiki: 'Memory', query: 'memory neuroscience' },
      { id: 'learning', name: 'Learning', wiki: 'Learning', query: 'learning neuroscience' },
      { id: 'attention', name: 'Attention', wiki: 'Attention', query: 'attention neuroscience' },
      { id: 'perception', name: 'Perception', wiki: 'Perception', query: 'perception neuroscience' },
      { id: 'emotion', name: 'Emotion', wiki: 'Emotion', query: 'emotion brain' },
      { id: 'cognition', name: 'Cognition', wiki: 'Cognition', query: 'cognition' },
      { id: 'consciousness', name: 'Consciousness', wiki: 'Consciousness', query: 'consciousness neuroscience' },
      { id: 'language', name: 'Language', wiki: 'Language', query: 'language neuroscience' },
      { id: 'motor-control', name: 'Motor control', wiki: 'Motor control', query: 'motor control' },
      { id: 'sleep', name: 'Sleep', wiki: 'Sleep', query: 'sleep neuroscience' },
      { id: 'decision-making', name: 'Decision-making', wiki: 'Decision-making', query: 'decision making neuroscience' },
      { id: 'behaviour', name: 'Behaviour', wiki: 'Behavior', query: 'behavior neuroscience' },
    ],
  },

  {
    id: 'disorders',
    name: 'Disorders / Clinical',
    blurb: 'Conditions of the nervous system — their biology, history, and treatment.',
    layout: 'groups',
    groups: [
      {
        name: 'Neurodegenerative',
        topics: [
          { id: 'alzheimers', name: "Alzheimer's disease", wiki: "Alzheimer's disease", query: 'Alzheimer disease' },
          { id: 'parkinsons', name: "Parkinson's disease", wiki: "Parkinson's disease", query: 'Parkinson disease' },
          { id: 'huntingtons', name: "Huntington's disease", wiki: "Huntington's disease", query: 'Huntington disease' },
          { id: 'als', name: 'Amyotrophic lateral sclerosis (ALS)', wiki: 'Amyotrophic lateral sclerosis', query: 'amyotrophic lateral sclerosis' },
        ],
      },
      {
        name: 'Psychiatric',
        topics: [
          { id: 'depression', name: 'Major depressive disorder', wiki: 'Major depressive disorder', query: 'major depressive disorder' },
          { id: 'schizophrenia', name: 'Schizophrenia', wiki: 'Schizophrenia', query: 'schizophrenia' },
          { id: 'bipolar', name: 'Bipolar disorder', wiki: 'Bipolar disorder', query: 'bipolar disorder' },
          { id: 'anxiety', name: 'Anxiety disorders', wiki: 'Anxiety disorder', query: 'anxiety disorder' },
        ],
      },
      {
        name: 'Developmental',
        topics: [
          { id: 'autism', name: 'Autism spectrum', wiki: 'Autism', query: 'autism spectrum disorder' },
          { id: 'adhd', name: 'ADHD', wiki: 'Attention deficit hyperactivity disorder', query: 'ADHD' },
        ],
      },
      {
        name: 'Injury & other',
        topics: [
          { id: 'stroke', name: 'Stroke', wiki: 'Stroke', query: 'stroke brain' },
          { id: 'tbi', name: 'Traumatic brain injury', wiki: 'Traumatic brain injury', query: 'traumatic brain injury' },
          { id: 'epilepsy', name: 'Epilepsy', wiki: 'Epilepsy', query: 'epilepsy' },
        ],
      },
    ],
  },

  {
    id: 'branches',
    name: 'Branches of Neuroscience',
    blurb: 'The many subfields of neuroscience — the distinct lenses through which the nervous system is studied.',
    layout: 'grid',
    topics: [
      { id: 'cognitive-neuro', name: 'Cognitive neuroscience', wiki: 'Cognitive neuroscience', query: 'cognitive neuroscience' },
      { id: 'behavioral-neuro', name: 'Behavioural neuroscience', wiki: 'Behavioral neuroscience', query: 'behavioral neuroscience' },
      { id: 'molecular-neuro', name: 'Molecular neuroscience', wiki: 'Molecular neuroscience', query: 'molecular neuroscience' },
      { id: 'cellular-neuro', name: 'Cellular neuroscience', wiki: 'Cellular neuroscience', query: 'cellular neuroscience' },
      { id: 'systems-neuro', name: 'Systems neuroscience', wiki: 'Systems neuroscience', query: 'systems neuroscience' },
      { id: 'computational-neuro', name: 'Computational neuroscience', wiki: 'Computational neuroscience', query: 'computational neuroscience' },
      { id: 'developmental-neuro', name: 'Developmental neuroscience', wiki: 'Developmental neuroscience', query: 'developmental neuroscience' },
      { id: 'clinical-neuro', name: 'Clinical neuroscience', wiki: 'Clinical neuroscience', query: 'clinical neuroscience' },
      { id: 'affective-neuro', name: 'Affective neuroscience', wiki: 'Affective neuroscience', query: 'affective neuroscience' },
      { id: 'social-neuro', name: 'Social neuroscience', wiki: 'Social neuroscience', query: 'social neuroscience' },
      { id: 'neuropsychology', name: 'Neuropsychology', wiki: 'Neuropsychology', query: 'neuropsychology' },
      { id: 'neuroengineering', name: 'Neuroengineering', wiki: 'Neural engineering', query: 'neural engineering' },
      { id: 'neurolinguistics', name: 'Neurolinguistics', wiki: 'Neurolinguistics', query: 'neurolinguistics' },
      { id: 'neuroendocrinology', name: 'Neuroendocrinology', wiki: 'Neuroendocrinology', query: 'neuroendocrinology' },
      { id: 'connectomics', name: 'Connectomics', wiki: 'Connectomics', query: 'connectomics' },
      { id: 'neuroethology', name: 'Neuroethology', wiki: 'Neuroethology', query: 'neuroethology' },
      { id: 'cultural-neuro', name: 'Cultural neuroscience', wiki: 'Cultural neuroscience', query: 'cultural neuroscience' },
    ],
  },

  {
    id: 'lifespan',
    name: 'Lifespan / Development',
    blurb: 'How the nervous system is built, changes, and ages over a lifetime.',
    layout: 'grid',
    topics: [
      { id: 'neurodevelopment', name: 'Neurodevelopment', wiki: 'Development of the nervous system', query: 'nervous system development' },
      { id: 'critical-periods', name: 'Critical periods', wiki: 'Critical period', query: 'critical period brain' },
      { id: 'plasticity', name: 'Neuroplasticity', wiki: 'Neuroplasticity', query: 'neuroplasticity' },
      { id: 'neurogenesis', name: 'Neurogenesis', wiki: 'Neurogenesis', query: 'neurogenesis' },
      { id: 'ageing', name: 'Ageing brain', wiki: 'Aging brain', query: 'brain aging' },
    ],
  },
]

// Flatten all topics to a lookup by id (used for routing).
export const TOPICS_BY_ID = {}
for (const cat of CATEGORIES) {
  const collect = (t) => { TOPICS_BY_ID[t.id] = { ...t, categoryId: cat.id } }
  if (cat.groups) cat.groups.forEach((g) => g.topics.forEach(collect))
  if (cat.topics) cat.topics.forEach(collect)
}

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id)
}

// Flat list of every topic with its category label — used by the search box.
export const ALL_TOPICS = Object.values(TOPICS_BY_ID).map((t) => ({
  id: t.id,
  name: t.name,
  categoryId: t.categoryId,
  categoryName: getCategory(t.categoryId)?.name || '',
}))

// Related topics = other topics in the same category. This is a structural
// relationship from the taxonomy, not generated/inferred content.
export function getSiblingTopics(topicId, limit = 6) {
  const topic = TOPICS_BY_ID[topicId]
  if (!topic) return []
  return ALL_TOPICS.filter(
    (t) => t.categoryId === topic.categoryId && t.id !== topicId
  ).slice(0, limit)
}

// Simple case-insensitive substring search across topic and category names.
export function searchTopics(query, limit = 8) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const scored = []
  for (const t of ALL_TOPICS) {
    const name = t.name.toLowerCase()
    const cat = t.categoryName.toLowerCase()
    let score = 0
    if (name === q) score = 100
    else if (name.startsWith(q)) score = 70
    else if (name.includes(q)) score = 50
    else if (cat.includes(q)) score = 20
    if (score) scored.push({ ...t, score })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}
