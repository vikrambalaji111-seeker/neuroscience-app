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
