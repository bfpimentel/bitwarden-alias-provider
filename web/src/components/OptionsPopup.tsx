import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import { loadOptionsConfig, generateOptionsString } from "../utils/alias";

interface OptionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OptionsPopup({ isOpen, onClose }: OptionsPopupProps) {
  const savedConfig = loadOptionsConfig();

  const [domain, setDomain] = useState(savedConfig.domain || "");
  const [destination, setDestination] = useState(savedConfig.destination || "");
  const [template, setTemplate] = useState(savedConfig.template || "<slug>");
  const [prefix, setPrefix] = useState(savedConfig.prefix || "");
  const [suffix, setSuffix] = useState(savedConfig.suffix || "");
  const [slugLength, setSlugLength] = useState(savedConfig.slugLength || "2");
  const [hexLength, setHexLength] = useState(savedConfig.hexLength || "6");
  const [aliasSeparator, setAliasSeparator] = useState(savedConfig.aliasSeparator || "_");
  const [slugSeparator, setSlugSeparator] = useState(savedConfig.slugSeparator || "_");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const config = {
      domain,
      destination,
      template,
      prefix,
      suffix,
      slugLength,
      hexLength,
      aliasSeparator,
      slugSeparator,
    };
    localStorage.setItem("bitwarden_alias_config", JSON.stringify(config));
  }, [
    domain,
    destination,
    template,
    prefix,
    suffix,
    slugLength,
    hexLength,
    aliasSeparator,
    slugSeparator,
  ]);

  const resultString = generateOptionsString({
    domain,
    destination,
    template,
    prefix,
    suffix,
    slugLength,
    hexLength,
    aliasSeparator,
    slugSeparator,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Generate Options String</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="example.com"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="target@email.com"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <input
                type="text"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="<slug><hex>"
              />
              <p className="text-xs text-gray-500 mt-1">Allowed: &lt;slug&gt;, &lt;hex&gt;</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug Length</label>
              <input
                type="number"
                value={slugLength}
                onChange={(e) => setSlugLength(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hex Length</label>
              <input
                type="number"
                value={hexLength}
                onChange={(e) => setHexLength(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alias Separator
              </label>
              <input
                type="text"
                value={aliasSeparator}
                onChange={(e) => setAliasSeparator(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug Separator</label>
              <input
                type="text"
                value={slugSeparator}
                onChange={(e) => setSlugSeparator(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Options String
            </label>
            <div className="flex gap-2 items-start">
              <textarea
                readOnly
                value={resultString}
                className="flex-1 p-2 bg-gray-50 border rounded font-mono text-sm text-gray-600 focus:outline-none min-h-[80px] resize-y"
              />
              <button
                onClick={copyToClipboard}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors flex items-center justify-center min-w-[44px] mt-1"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
