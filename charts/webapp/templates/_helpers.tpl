{{- define "cluster_name" -}}
{{- $matches := split "." ( .Values.spec.destination.server | toString ) -}}
{{- $matches._1 -}}
{{- end -}}

{{- define "edge_registry" -}}
{{- $match := .Values.spec.destination.server | toString | regexFind "api.*:" -}}
{{- $match | trimAll ":" | trimAll "api." -}}
{{- $match | pritnf "quay.apps.%s" . -}}
{{- end -}}

{{- define "cluster_fqdn" -}}
{{- $match := .Values.spec.destination.server | toString | regexFind "api.*:" -}}
{{- $match | trimAll ":" | trimAll "api." -}}
{{- end -}}
