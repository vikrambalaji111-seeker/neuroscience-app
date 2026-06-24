// ---------------------------------------------------------------------------
// TAXONOMY — structural backbone only.
//
// This file contains NO neuroscience facts. It defines the browse structure
// (categories -> topics) and, for each topic, *where* to fetch real content:
//   - wiki:  the exact English Wikipedia article title (overview + sections)
//   - query: a search string for the Europe PMC literature API (studies/papers)
//
// All displayed knowledge is fetched live from those sources at runtime and
// shown with attribution. Nothing here is generated content.
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  {
    id: 'ns101',
    name: 'Neuroscience 101',
    blurb:
      'Start here. A comprehensive foundation in neuroscience — from molecules and single cells, through anatomy, the senses and movement, up to cognition, development, disorders, and the methods used to study the brain.',
    layout: 'groups',
    featured: true,
    groups: [
      {
        name: '1 · Cellular & Molecular Neurobiology',
        topics: [
          { id: 'ns101-neurons-glia', name: 'Neurons & glia', wiki: 'Neuron', query: 'neurons glia nervous system' },
          { id: 'ns101-myelin', name: 'Myelin & axonal conduction', wiki: 'Myelin', query: 'myelin oligodendrocyte conduction' },
          { id: 'ns101-membrane-potential', name: 'The resting membrane potential', wiki: 'Membrane potential', query: 'resting membrane potential' },
          { id: 'ns101-action-potential', name: 'Action potentials', wiki: 'Action potential', query: 'action potential depolarization' },
          { id: 'ns101-ion-channels', name: 'Ion channels & pumps', wiki: 'Ion channel', query: 'ion channel sodium potassium pump' },
          { id: 'ns101-synapse', name: 'The synapse', wiki: 'Synapse', query: 'synapse structure' },
          { id: 'ns101-synaptic-transmission', name: 'Synaptic transmission', wiki: 'Neurotransmission', query: 'synaptic transmission' },
          { id: 'ns101-neurotransmitters', name: 'Neurotransmitters & receptors', wiki: 'Neurotransmitter', query: 'neurotransmitter receptor' },
        ],
      },
      {
        name: '2 · Neuroanatomy & Organisation',
        topics: [
          { id: 'ns101-cns-pns', name: 'Central & peripheral nervous system', wiki: 'Central nervous system', query: 'central peripheral nervous system' },
          { id: 'ns101-autonomic', name: 'Autonomic nervous system', wiki: 'Autonomic nervous system', query: 'autonomic sympathetic parasympathetic' },
          { id: 'ns101-cortex', name: 'The cerebral cortex', wiki: 'Cerebral cortex', query: 'cerebral cortex' },
          { id: 'ns101-lobes', name: 'The major lobes', wiki: 'Lobes of the brain', query: 'frontal parietal temporal occipital lobe' },
          { id: 'ns101-thalamus', name: 'Thalamus', wiki: 'Thalamus', query: 'thalamus relay' },
          { id: 'ns101-basal-ganglia', name: 'Basal ganglia', wiki: 'Basal ganglia', query: 'basal ganglia movement' },
          { id: 'ns101-limbic', name: 'The limbic system', wiki: 'Limbic system', query: 'limbic system emotion' },
          { id: 'ns101-brainstem', name: 'The brainstem', wiki: 'Brainstem', query: 'brainstem breathing' },
          { id: 'ns101-spinal-cord', name: 'The spinal cord', wiki: 'Spinal cord', query: 'spinal cord' },
          { id: 'ns101-protection', name: 'Meninges, ventricles & CSF', wiki: 'Cerebrospinal fluid', query: 'cerebrospinal fluid meninges ventricles' },
          { id: 'ns101-bbb', name: 'Blood–brain barrier', wiki: 'Blood–brain barrier', query: 'blood brain barrier' },
        ],
      },
      {
        name: '3 · Sensory Systems',
        topics: [
          { id: 'ns101-sensation', name: 'Sensation & transduction', wiki: 'Sensory nervous system', query: 'sensory transduction receptor' },
          { id: 'ns101-vision', name: 'Vision', wiki: 'Visual system', query: 'visual system' },
          { id: 'ns101-retina', name: 'The retina', wiki: 'Retina', query: 'retina photoreceptor' },
          { id: 'ns101-audition', name: 'Hearing', wiki: 'Auditory system', query: 'auditory system' },
          { id: 'ns101-cochlea', name: 'The cochlea', wiki: 'Cochlea', query: 'cochlea hair cell' },
          { id: 'ns101-somatosensation', name: 'Touch & somatosensation', wiki: 'Somatosensory system', query: 'somatosensory system' },
          { id: 'ns101-pain', name: 'Pain & nociception', wiki: 'Nociception', query: 'nociception pain' },
          { id: 'ns101-olfaction', name: 'Smell', wiki: 'Olfaction', query: 'olfaction smell' },
          { id: 'ns101-taste', name: 'Taste', wiki: 'Taste', query: 'taste gustation' },
          { id: 'ns101-receptive-fields', name: 'Receptive fields', wiki: 'Receptive field', query: 'receptive field' },
        ],
      },
      {
        name: '4 · Motor Systems & Movement',
        topics: [
          { id: 'ns101-motor-cortex', name: 'Voluntary movement & the motor cortex', wiki: 'Motor cortex', query: 'motor cortex voluntary movement' },
          { id: 'ns101-nmj', name: 'The neuromuscular junction', wiki: 'Neuromuscular junction', query: 'neuromuscular junction' },
          { id: 'ns101-cerebellum', name: 'The cerebellum', wiki: 'Cerebellum', query: 'cerebellum coordination' },
          { id: 'ns101-reflexes', name: 'Reflexes', wiki: 'Reflex', query: 'reflex arc' },
          { id: 'ns101-motor-learning', name: 'Motor learning', wiki: 'Motor learning', query: 'motor learning skill' },
        ],
      },
      {
        name: '5 · Higher Cognitive Functions',
        topics: [
          { id: 'ns101-learning', name: 'Learning', wiki: 'Learning', query: 'learning brain' },
          { id: 'ns101-memory', name: 'Memory & the hippocampus', wiki: 'Memory', query: 'memory hippocampus' },
          { id: 'ns101-plasticity-syn', name: 'Synaptic plasticity', wiki: 'Synaptic plasticity', query: 'synaptic plasticity' },
          { id: 'ns101-ltp', name: 'Long-term potentiation (LTP)', wiki: 'Long-term potentiation', query: 'long-term potentiation' },
          { id: 'ns101-attention', name: 'Attention', wiki: 'Attention', query: 'attention brain' },
          { id: 'ns101-emotion', name: 'Emotion & the amygdala', wiki: 'Emotion', query: 'emotion amygdala' },
          { id: 'ns101-reward', name: 'Motivation & reward', wiki: 'Reward system', query: 'reward system dopamine' },
          { id: 'ns101-homeostasis', name: 'Homeostasis & the hypothalamus', wiki: 'Hypothalamus', query: 'hypothalamus homeostasis' },
          { id: 'ns101-language', name: 'Language', wiki: 'Language', query: 'language brain' },
          { id: 'ns101-executive', name: 'Executive function', wiki: 'Executive functions', query: 'executive function prefrontal' },
          { id: 'ns101-sleep', name: 'Sleep & circadian rhythms', wiki: 'Sleep', query: 'sleep circadian' },
          { id: 'ns101-consciousness', name: 'Consciousness', wiki: 'Consciousness', query: 'consciousness neuroscience' },
        ],
      },
      {
        name: '6 · Development, Plasticity & Ageing',
        topics: [
          { id: 'ns101-neurodevelopment', name: 'Neurodevelopment', wiki: 'Development of the nervous system', query: 'nervous system development' },
          { id: 'ns101-neurogenesis', name: 'Neurogenesis', wiki: 'Neurogenesis', query: 'neurogenesis' },
          { id: 'ns101-critical-periods', name: 'Critical periods', wiki: 'Critical period', query: 'critical period plasticity' },
          { id: 'ns101-neuroplasticity', name: 'Neuroplasticity', wiki: 'Neuroplasticity', query: 'neuroplasticity' },
          { id: 'ns101-aging', name: 'The ageing brain', wiki: 'Aging brain', query: 'brain aging' },
        ],
      },
      {
        name: '7 · Disorders & Clinical Neuroscience',
        topics: [
          { id: 'ns101-neurodegeneration', name: 'Neurodegenerative disease', wiki: 'Neurodegeneration', query: 'neurodegenerative disease' },
          { id: 'ns101-alzheimers', name: "Alzheimer's disease", wiki: "Alzheimer's disease", query: 'Alzheimer disease' },
          { id: 'ns101-parkinsons', name: "Parkinson's disease", wiki: "Parkinson's disease", query: 'Parkinson disease' },
          { id: 'ns101-stroke', name: 'Stroke', wiki: 'Stroke', query: 'stroke brain' },
          { id: 'ns101-epilepsy', name: 'Epilepsy', wiki: 'Epilepsy', query: 'epilepsy seizure' },
          { id: 'ns101-psychiatric', name: 'Psychiatric disorders', wiki: 'Mental disorder', query: 'psychiatric disorder' },
          { id: 'ns101-addiction', name: 'Addiction', wiki: 'Addiction', query: 'addiction brain reward' },
        ],
      },
      {
        name: '8 · Studying the Brain — Methods & History',
        topics: [
          { id: 'ns101-methods', name: 'How we study the brain', wiki: 'Neuroimaging', query: 'neuroimaging methods' },
          { id: 'ns101-fmri', name: 'fMRI', wiki: 'Functional magnetic resonance imaging', query: 'fMRI BOLD' },
          { id: 'ns101-eeg', name: 'EEG', wiki: 'Electroencephalography', query: 'EEG electroencephalography' },
          { id: 'ns101-electrophysiology', name: 'Electrophysiology & patch clamp', wiki: 'Patch clamp', query: 'patch clamp electrophysiology' },
          { id: 'ns101-optogenetics', name: 'Optogenetics', wiki: 'Optogenetics', query: 'optogenetics' },
          { id: 'ns101-bci', name: 'Brain–computer interfaces', wiki: 'Brain–computer interface', query: 'brain computer interface' },
          { id: 'ns101-history', name: 'History of neuroscience', wiki: 'History of neuroscience', query: 'history of neuroscience' },
        ],
      },
    ],
  },

  {
    id: 'anatomy',
    name: 'Anatomy / Structure',
    blurb:
      'The physical architecture of the nervous system — regions, cells, and circuits.',
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
    id: 'neurochemistry',
    name: 'Neurochemistry / Signalling',
    blurb: 'The chemical messengers and signalling systems of the brain.',
    layout: 'grid',
    topics: [
      { id: 'dopamine', name: 'Dopamine', wiki: 'Dopamine', query: 'dopamine' },
      { id: 'serotonin', name: 'Serotonin', wiki: 'Serotonin', query: 'serotonin' },
      { id: 'glutamate', name: 'Glutamate', wiki: 'Glutamate (neurotransmitter)', query: 'glutamate neurotransmitter' },
      { id: 'gaba', name: 'GABA', wiki: 'Gamma-Aminobutyric acid', query: 'GABA neurotransmitter' },
      { id: 'acetylcholine', name: 'Acetylcholine', wiki: 'Acetylcholine', query: 'acetylcholine' },
      { id: 'norepinephrine', name: 'Norepinephrine', wiki: 'Norepinephrine', query: 'norepinephrine' },
      { id: 'neuromodulation', name: 'Neuromodulation', wiki: 'Neuromodulation', query: 'neuromodulation' },
      { id: 'receptors', name: 'Neurotransmitter receptors', wiki: 'Neurotransmitter receptor', query: 'neurotransmitter receptor' },
      { id: 'hormones', name: 'Neuroendocrine / hormones', wiki: 'Neuroendocrinology', query: 'neuroendocrine hormones brain' },
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
