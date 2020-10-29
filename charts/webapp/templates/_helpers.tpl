{{- define "cluster_name" -}}
{{- $matches := split "." ( .Values.spec.destination.server | toString ) -}}
{{- $matches._1 -}}
{{- end -}}

{{- define "registry_dns" -}}
{{- $match | pritnf "quay.apps.%s" . -}}
{{- end -}}

{{- define "cluster_fqdn" -}}
{{- $match := .Values.spec.destination.server | toString | regexFind "api.*:" -}}
{{- $match | trimAll ":" | trimAll "api." -}}
{{- end -}}


{{- define "edge_registry" -}}
{{ template "registry_dns" .}}.{{ template "cluster_fqdn" .}}
{{- end -}}
