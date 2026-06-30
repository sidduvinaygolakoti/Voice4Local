package com.localvoice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public AIService() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public String analyzeMessage(String message, String language) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("YOUR_")) {
            logger.warn("Gemini API key is not configured. Using rule-based fallback response.");
            return getFallbackResponse(message, language);
        }

        try {
            // Build the system prompt + user message combination
            String systemInstructions = "You are LOCAL HELP AI, a helpful civic assistant for Indian citizens. " +
                    "Your role is to understand local civic problems described in English, Telugu, or Hindi, " +
                    "identify the responsible department, suggest practical actions/solutions, and estimate resolution times. " +
                    "Respond in a helpful, empathetic manner in " + (language.equalsIgnoreCase("te") ? "Telugu" : language.equalsIgnoreCase("hi") ? "Hindi" : "English") + ". " +
                    "Use emojis and clear bullet points.";

            // Gemini API expects request body like:
            // {
            //   "contents": [
            //     {
            //       "parts": [
            //         {"text": "system instructions"},
            //         {"text": "user message"}
            //       ]
            //     }
            //   ]
            // }
            ObjectNode requestBodyJson = objectMapper.createObjectNode();
            ArrayNode contentsArray = requestBodyJson.putArray("contents");
            ObjectNode contentObj = contentsArray.addObject();
            ArrayNode partsArray = contentObj.putArray("parts");
            
            // Add instructions and prompt
            partsArray.addObject().put("text", systemInstructions + "\n\nUser Message: " + message);

            RequestBody body = RequestBody.create(
                    objectMapper.writeValueAsString(requestBodyJson),
                    MediaType.get("application/json; charset=utf-8")
            );

            String finalUrl = apiUrl + "?key=" + apiKey;

            Request request = new Request.Builder()
                    .url(finalUrl)
                    .post(body)
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseBodyString = response.body().string();
                    JsonNode root = objectMapper.readTree(responseBodyString);
                    JsonNode textNode = root.path("candidates")
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");
                    if (!textNode.isMissingNode()) {
                        return textNode.asText();
                    }
                }
                logger.warn("Gemini API request failed or returned unexpected structure: " + response.code());
            }
        } catch (IOException e) {
            logger.error("Error communicating with Gemini API: " + e.getMessage(), e);
        }

        return getFallbackResponse(message, language);
    }

    private String getFallbackResponse(String text, String language) {
        String lower = text.toLowerCase();
        
        if (language.equalsIgnoreCase("te")) {
            if (lower.contains("road") || lower.contains("pothole") || lower.contains("రోడ్") || lower.contains("గుంతలు")) {
                return "🛣️ **రోడ్డు / గుంతల సమస్య గుర్తించబడింది!**\n\n" +
                        "**బాధ్యత గల విభాగం:** మునిసిపల్ కార్పొరేషన్ / పంచాయితీ రాజ్ ఇంజనీరింగ్ విభాగం\n\n" +
                        "**చేయవలసిన పనులు:**\n" +
                        "- ఇది నగర పరిధిలో ఉంటే → మునిసిపల్ కార్పొరేషన్ కార్యాలయాన్ని సంప్రదించండి\n" +
                        "- ఇది గ్రామ పరిధిలో ఉంటే → పంచాయితీ సెక్రటరీని సంప్రదించండి\n\n" +
                        "**పరిష్కార సమయం:** 7 నుండి 14 పని దినాలు\n\n" +
                        "నేను మీకు అధికారిక ఫిర్యాదు రాయడంలో సహాయపడాలా? 📝";
            }
            if (lower.contains("water") || lower.contains("నీళ్ళు") || lower.contains("నీరు")) {
                return "💧 **నీటి సరఫరా సమస్య గుర్తించబడింది!**\n\n" +
                        "**బాధ్యత గల విభాగం:** నీటి సరఫరా విభాగం / మునిసిపాలిటీ\n\n" +
                        "**చేయవలసిన పనులు:**\n" +
                        "1. మీ స్థానిక వాటర్ ట్యాంక్ సరఫరా సమయాన్ని తనిఖీ చేయండి.\n" +
                        "2. కలుషిత నీరు వస్తే వెంటనే ఆరోగ్య శాఖకు సమాచారం ఇవ్వండి.\n\n" +
                        "**పరిష్కార సమయం:** 3 నుండి 5 రోజులు\n\n" +
                        "ఫిర్యాదు చేయడానికి దయచేసి పోర్టల్‌లో కొత్త ఫిర్యాదును నమోదు చేయండి. 📝";
            }
            return "🤖 **హలో! నేను లోకల్ హెల్ప్ AI ని.**\n\n" +
                    "నేను మీ సమస్యను అర్థం చేసుకున్నాను. ఇది మున్సిపాలిటీ లేదా పంచాయతీకి సంబంధించిన ప్రజా సమస్యలా కనిపిస్తోంది.\n\n" +
                    "**సిఫార్సు:** దయచేసి 'ఫిర్యాదు నమోదు చేయండి' (Raise Complaint) పేజీ ద్వారా మీ సమస్యను ఫోటోలతో సహా అప్‌లోడ్ చేసి ఫిర్యాదు నమోదు చేయండి. అధికారులు దీనిని త్వరగా పరిష్కరిస్తారు.";
        }

        if (language.equalsIgnoreCase("hi")) {
            if (lower.contains("road") || lower.contains("pothole") || lower.contains("सड़क") || lower.contains("गड्ढे")) {
                return "🛣️ **सड़क / गड्ढे की समस्या की पहचान की गई!**\n\n" +
                        "**जिम्मेदार विभाग:** नगर निगम / पंचायत राज इंजीनियरिंग विभाग\n\n" +
                        "**क्या करें:**\n" +
                        "- यदि शहर की सड़क है → नगर निगम से संपर्क करें\n" +
                        "- यदि ग्रामीण सड़क है → पंचायत सचिव से संपर्क करें\n\n" +
                        "**अनुमानित समय:** 7 से 14 कार्य दिवस\n\n" +
                        "क्या आप चाहते हैं कि मैं औपचारिक शिकायत लिखने में आपकी मदद करूँ? 📝";
            }
            if (lower.contains("water") || lower.contains("पानी") || lower.contains("जल")) {
                return "💧 **पानी की आपूर्ति की समस्या!**\n\n" +
                        "**जिम्मेदार विभाग:** जल आपूर्ति विभाग / नगरपालिका\n\n" +
                        "**क्या करें:**\n" +
                        "1. अपने स्थानीय पानी की टंकी की जांच करें।\n" +
                        "2. यदि पानी प्रदूषित है तो स्वास्थ्य विभाग को रिपोर्ट करें।\n\n" +
                        "**अनुमानित समय:** 3 से 5 दिन\n\n" +
                        "शिकायत दर्ज करने के लिए कृपया हमारे पोर्टल का उपयोग करें। 📝";
            }
            return "🤖 **नमस्ते! मैं लोकल हेल्प एआई हूँ।**\n\n" +
                    "मैंने आपकी समस्या समझ ली है। यह एक नागरिक समस्या है जिसे स्थानीय प्रशासन द्वारा हल किया जा सकता है।\n\n" +
                    "**सुझाव:** कृपया समस्या की तस्वीरों के साथ पोर्टल पर 'शिकायत दर्ज करें' पेज पर जाएं और शिकायत दर्ज करें।";
        }

        // Default English
        if (lower.contains("road") || lower.contains("pothole")) {
            return "🛣️ **Road / Pothole Issue Identified!**\n\n" +
                    "**Responsible Department:** Municipal Corporation / Panchayat Raj Engineering Department\n\n" +
                    "**What to do:**\n" +
                    "- If on a city road → Contact Municipal Corporation\n" +
                    "- If on a village road → Contact Panchayat Secretary / PRED\n" +
                    "- If on a national/state highway → Contact NHAI / PWD\n\n" +
                    "**Expected Resolution:** 7-14 working days\n\n" +
                    "Would you like me to help write a formal complaint? 📝";
        }
        if (lower.contains("water")) {
            return "💧 **Water Supply Issue Identified!**\n\n" +
                    "**Responsible Department:** Water Supply Department / Municipality\n\n" +
                    "**Immediate Steps:**\n" +
                    "1. Check if your local overhead tank has supply\n" +
                    "2. Contact your ward councillor\n" +
                    "3. If tap water is contaminated, report to Health Department\n\n" +
                    "**Expected Resolution:** 3-5 days for supply issues\n\n" +
                    "Ready to write your formal complaint? Just ask! 📝";
        }
        if (lower.contains("light") || lower.contains("electricity") || lower.contains("power")) {
            return "⚡ **Electricity / Street Light Issue!**\n\n" +
                    "**Responsible Department:** DISCOMS / Municipality (for street lights)\n\n" +
                    "**Quick checks:**\n" +
                    "- Main road street lights → Municipality / City Development Authority\n" +
                    "- Lane/colony lights or billing issues → State DISCOM (Electricity Board)\n\n" +
                    "**Expected Resolution:** 24-48 hours for power cuts, 3-7 days for street lights\n\n" +
                    "Would you like me to generate a complaint draft for you? 📝";
        }
        if (lower.contains("garbage") || lower.contains("waste") || lower.contains("trash") || lower.contains("clean")) {
            return "🗑️ **Garbage / Waste Disposal Issue!**\n\n" +
                    "**Responsible Department:** Municipal Sanitation Department / Gram Panchayat Sanitation Wing\n\n" +
                    "**Key Information:**\n" +
                    "- Check if the collection vehicle visits your area daily.\n" +
                    "- Report public littering or blocked dump yards directly through Local Voice.\n\n" +
                    "**Expected Resolution:** 24-48 hours\n\n" +
                    "Please raise a complaint with pictures of the garbage pile so sanitation officers can locate it easily. 📷";
        }

        return "🤖 **Hello! I'm LOCAL HELP AI.**\n\n" +
                "I can help you analyze your local problems and suggest the right department.\n\n" +
                "**Common categories:**\n" +
                "- Road Issues 🛣️\n" +
                "- Water Supply Problems 💧\n" +
                "- Street Light & Electricity Issues ⚡\n" +
                "- Garbage / Drainage Problems 🗑️\n\n" +
                "Describe your problem in detail, or go directly to the 'Raise Query' page to file an official report to local authorities!";
    }
}
